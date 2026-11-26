import { randomBytes, randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { storagePut, storagePutReceipt, validateReceiptUpload } from "./storage";
import {
  createMediaFile,
  createProduct,
  createSellerApplication,
  decideSellerApplication,
  getActiveSellerCount,
  getSellerApplicationById,
  getSellerApplicationByToken,
  listProducts,
  listSellerApplications,
  updateSellerApplicationProfile,
} from "./db";

const adminPassword = process.env.ADMIN_PANEL_PASSWORD ?? "admin2026";
const MAX_ACTIVE_SELLERS = 30;

const applicationInput = z.object({
  fullName: z.string().trim().min(2).max(160),
  projectName: z.string().trim().min(2).max(160),
  whatsapp: z.string().trim().min(8).max(32),
  category: z.string().trim().min(1).max(64),
  description: z.string().trim().min(10).max(5000),
  planType: z.enum(["monthly", "yearly"]).default("monthly"),
  senderAccountName: z.string().trim().min(2).max(160).optional(),
  referenceNumber: z.string().trim().max(120).optional(),
  receiptData: z.string().min(20).max(15_000_000).optional(),
  receiptFileName: z.string().trim().max(255).optional(),
  receiptMimeType: z.enum(["image/jpeg", "image/png"]).optional(),
});

const profileInput = z.object({
  accessToken: z.string().trim().min(4).max(32),
  fullName: z.string().trim().min(2).max(160).optional(),
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
  if (password !== adminPassword) throw new TRPCError({ code: "FORBIDDEN", message: "بيانات الإدارة غير صحيحة" });
}

function makeAccessToken() {
  return `AB${randomBytes(4).toString("hex").toUpperCase()}`;
}

function parseBase64Data(data: string) {
  const match = data.match(/^data:([^;]+);base64,(.*)$/);
  return { mimeType: match?.[1] ?? "", base64: match?.[2] ?? data };
}

function planAmount(planType: "monthly" | "yearly") {
  return planType === "monthly" ? "10" : "100";
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
  catalog: router({ list: publicProcedure.query(() => listProducts()) }),
  seller: router({
    submitApplication: publicProcedure.input(applicationInput).mutation(async ({ input }) => {
      let receiptUrl: string | undefined;
      if (input.receiptData) {
        const parsed = parseBase64Data(input.receiptData);
        const mimeType = input.receiptMimeType || parsed.mimeType;
        if (mimeType !== parsed.mimeType && parsed.mimeType) throw new TRPCError({ code: "BAD_REQUEST", message: "نوع ملف الإيصال غير مطابق" });
        const buffer = Buffer.from(parsed.base64, "base64");
        try {
          validateReceiptUpload(mimeType, buffer.length);
        } catch (error) {
          throw new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "إيصال غير صالح" });
        }
        const uploaded = await storagePutReceipt(randomUUID(), buffer, mimeType);
        receiptUrl = uploaded.url;
      }
      return createSellerApplication({
        fullName: input.fullName,
        projectName: input.projectName,
        whatsapp: input.whatsapp,
        category: input.category,
        description: input.description,
        planType: input.planType,
        receiptUrl: receiptUrl ?? "",
        senderAccountName: input.senderAccountName || input.fullName,
        referenceNumber: input.referenceNumber,
      });
    }),
    login: publicProcedure.input(z.object({ accessToken: z.string().trim().min(4).max(32) })).query(async ({ input }) => {
      const seller = await getSellerApplicationByToken(input.accessToken.toUpperCase());
      if (!seller || seller.status !== "approved") throw new TRPCError({ code: "UNAUTHORIZED", message: "رمز الدخول غير صحيح أو لم تتم الموافقة على الطلب بعد" });
      return seller;
    }),
    updateProfile: publicProcedure.input(profileInput).mutation(async ({ input }) => {
      const seller = await getSellerApplicationByToken(input.accessToken.toUpperCase());
      if (!seller || seller.status !== "approved") throw new TRPCError({ code: "UNAUTHORIZED", message: "انتهت صلاحية جلسة البائع" });
      return updateSellerApplicationProfile({ id: seller.id, projectName: input.projectName, whatsapp: input.whatsapp, category: input.category, description: input.description });
    }),
    createProduct: publicProcedure.input(productInput).mutation(async ({ input }) => {
      const seller = await getSellerApplicationByToken(input.accessToken.toUpperCase());
      if (!seller || seller.status !== "approved") throw new TRPCError({ code: "UNAUTHORIZED", message: "انتهت صلاحية جلسة البائع" });
      let imageUrl = input.imageUrl || "/manus-storage/product-giftbox_dac71a12.jpg";
      let imageKey: string | undefined;
      let uploadedFile: { fileName: string; mimeType: string; sizeBytes: number } | undefined;
      if (input.imageData) {
        const parsed = parseBase64Data(input.imageData);
        const mimeType = input.imageMimeType || parsed.mimeType;
        const buffer = Buffer.from(parsed.base64, "base64");
        if (!buffer.length || buffer.length > 10 * 1024 * 1024) throw new TRPCError({ code: "BAD_REQUEST", message: "حجم الصورة يجب أن يكون أقل من 10 ميغابايت" });
        const safeName = (input.imageFileName || "product.jpg").replace(/[^a-z0-9._-]/gi, "-");
        const uploaded = await storagePut(`products/${seller.id}/${Date.now()}-${safeName}`, buffer, mimeType);
        imageUrl = uploaded.url;
        imageKey = uploaded.key;
        uploadedFile = { fileName: safeName, mimeType, sizeBytes: buffer.length };
      }
      const productId = await createProduct({ sellerApplicationId: seller.id, name: input.name, shortDescription: input.shortDescription, description: input.description, price: input.price, seller: seller.projectName, sellerPhone: seller.whatsapp, category: input.category, imageUrl, imageKey });
      if (uploadedFile && imageKey) await createMediaFile({ productId, storageKey: imageKey, url: imageUrl, ...uploadedFile });
      return { id: String(productId), imageUrl };
    }),
  }),
  admin: router({
    applications: publicProcedure.input(z.object({ password: z.string() })).query(async ({ input }) => {
      requireAdmin(input.password);
      return listSellerApplications();
    }),
    decideApplication: publicProcedure.input(z.object({ password: z.string(), id: z.number().int().positive(), status: z.enum(["approved", "rejected"]) })).mutation(async ({ input }) => {
      requireAdmin(input.password);
      const current = await getSellerApplicationById(input.id);
      if (!current) throw new TRPCError({ code: "NOT_FOUND", message: "طلب البائع غير موجود" });
      if (input.status === "approved" && current.status !== "approved") {
        const activeCount = await getActiveSellerCount();
        if (activeCount >= MAX_ACTIVE_SELLERS) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "تم بلوغ الحد الأقصى: 30 متجراً نشطاً" });
        if (!current.receiptUrl || !current.senderAccountName) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن التفعيل دون إيصال واسم صاحب الحساب" });
      }
      return decideSellerApplication(input.id, input.status, input.status === "approved" ? makeAccessToken() : undefined);
    }),
  }),
});

export type AppRouter = typeof appRouter;
