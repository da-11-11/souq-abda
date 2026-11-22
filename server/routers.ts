import { randomBytes } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";
import {
  createMediaFile,
  createProduct,
  createSellerApplication,
  decideSellerApplication,
  getSellerApplicationByToken,
  listProducts,
  listSellerApplications,
  updateSellerApplicationProfile,
} from "./db";

const adminPassword = process.env.ADMIN_PANEL_PASSWORD ?? "admin2026";

const applicationInput = z.object({
  fullName: z.string().trim().min(2).max(160),
  projectName: z.string().trim().min(2).max(160),
  whatsapp: z.string().trim().min(8).max(32),
  category: z.string().trim().min(1).max(64),
  description: z.string().trim().min(10).max(5000),
});

const productInput = z.object({
  accessToken: z.string().trim().min(4).max(32),
  name: z.string().trim().min(2).max(180),
  shortDescription: z.string().trim().min(5).max(320),
  description: z.string().trim().min(10).max(8000),
  price: z.string().trim().min(1).max(64),
  category: z.string().trim().min(1).max(64),
  imageUrl: z.string().trim().max(2000).optional(),
  imageData: z.string().max(15_000_000).optional(),
  imageFileName: z.string().trim().max(255).optional(),
  imageMimeType: z.string().trim().max(120).optional(),
});

function requireAdmin(password: string) {
  if (password !== adminPassword) {
    throw new TRPCError({ code: "FORBIDDEN", message: "بيانات الإدارة غير صحيحة" });
  }
}

function makeAccessToken() {
  return `AB${randomBytes(4).toString("hex").toUpperCase()}`;
}

function parseImageData(imageData: string) {
  const match = imageData.match(/^data:([^;]+);base64,(.*)$/);
  return {
    mimeType: match?.[1] ?? "application/octet-stream",
    base64: match?.[2] ?? imageData,
  };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  catalog: router({
    list: publicProcedure.query(() => listProducts()),
  }),

  seller: router({
    submitApplication: publicProcedure.input(applicationInput).mutation(({ input }) =>
      createSellerApplication(input),
    ),
    login: publicProcedure
      .input(z.object({ accessToken: z.string().trim().min(4).max(32) }))
      .query(async ({ input }) => {
        const seller = await getSellerApplicationByToken(input.accessToken.toUpperCase());
        if (!seller || seller.status !== "approved") {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "رمز الدخول غير صحيح أو لم تتم الموافقة على الطلب بعد" });
        }
        return seller;
      }),
    updateProfile: publicProcedure
      .input(
        applicationInput.extend({
          accessToken: z.string().trim().min(4).max(32),
        }),
      )
      .mutation(async ({ input }) => {
        const seller = await getSellerApplicationByToken(input.accessToken.toUpperCase());
        if (!seller || seller.status !== "approved") {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "انتهت صلاحية جلسة البائع" });
        }
        return updateSellerApplicationProfile({
          id: seller.id,
          projectName: input.projectName,
          whatsapp: input.whatsapp,
          category: input.category,
          description: input.description,
        });
      }),
    createProduct: publicProcedure.input(productInput).mutation(async ({ input }) => {
      const seller = await getSellerApplicationByToken(input.accessToken.toUpperCase());
      if (!seller || seller.status !== "approved") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "انتهت صلاحية جلسة البائع" });
      }

      let imageUrl = input.imageUrl || "/manus-storage/product-giftbox_dac71a12.jpg";
      let imageKey: string | undefined;
      let uploadedFile: { fileName: string; mimeType: string; sizeBytes: number } | undefined;

      if (input.imageData) {
        const parsed = parseImageData(input.imageData);
        const mimeType = input.imageMimeType || parsed.mimeType;
        const extension = (input.imageFileName?.split(".").pop() || "jpg").replace(/[^a-z0-9]/gi, "") || "jpg";
        const safeName = (input.imageFileName || `product.${extension}`).replace(/[^a-z0-9._-]/gi, "-");
        const buffer = Buffer.from(parsed.base64, "base64");
        if (!buffer.length || buffer.length > 10 * 1024 * 1024) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "حجم الصورة يجب أن يكون أقل من 10 ميغابايت" });
        }
        const uploaded = await storagePut(
          `products/${seller.id}/${Date.now()}-${safeName}`,
          buffer,
          mimeType,
        );
        imageUrl = uploaded.url;
        imageKey = uploaded.key;
        uploadedFile = { fileName: safeName, mimeType, sizeBytes: buffer.length };
      }

      const productId = await createProduct({
        sellerApplicationId: seller.id,
        name: input.name,
        shortDescription: input.shortDescription,
        description: input.description,
        price: input.price,
        seller: seller.projectName,
        sellerPhone: seller.whatsapp,
        category: input.category,
        imageUrl,
        imageKey,
      });

      if (uploadedFile && imageKey) {
        await createMediaFile({
          productId,
          storageKey: imageKey,
          url: imageUrl,
          ...uploadedFile,
        });
      }

      return { id: String(productId), imageUrl };
    }),
  }),

  admin: router({
    applications: publicProcedure
      .input(z.object({ password: z.string() }))
      .query(async ({ input }) => {
        requireAdmin(input.password);
        return listSellerApplications();
      }),
    decideApplication: publicProcedure
      .input(
        z.object({
          password: z.string(),
          id: z.number().int().positive(),
          status: z.enum(["approved", "rejected"]),
        }),
      )
      .mutation(async ({ input }) => {
        requireAdmin(input.password);
        return decideSellerApplication(
          input.id,
          input.status,
          input.status === "approved" ? makeAccessToken() : undefined,
        );
      }),
  }),
});

export type AppRouter = typeof appRouter;
