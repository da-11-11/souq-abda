import { randomBytes, randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut, storagePutReceipt, validateReceiptUpload } from "./storage";
import {
  createMediaFile,
  createDirectFreeTrial,
  createProduct,
  createSlotUpgradeRequest,
  createSellerApplication,
  decideSlotUpgradeRequest,
  decideSellerApplication,
  getActiveFreeTrialCount,
  getActiveSellerCount,
  getAdminOverview,
  getPlatformSettings,
  getSellerApplicationById,
  getSellerApplicationByAccount,
  ensureOwnerSellerApplication,
  getSellerApplicationByToken,
  getSellerProductStats,
  incrementProductMetric,
  listProducts,
  listAdminProducts,
  listSlotUpgradeRequests,
  listSellerApplications,
  updatePlatformSettings,
  updateSellerApplicationProfile,
  setProductFeatured,
  deleteProduct,
  renewSeller,
  setSellerSuspended,
} from "./db";

const MAX_ACTIVE_SELLERS = 30;

const applicationInput = z.object({
  fullName: z.string().trim().min(2).max(160),
  projectName: z.string().trim().min(2).max(160),
  whatsapp: z.string().trim().max(32).optional(),
  socialUrl: z.string().trim().max(500).optional(),
  category: z.string().trim().min(1).max(64),
  description: z.string().trim().min(10).max(5000),
  planType: z.enum(["free_trial", "monthly", "yearly"]).default("monthly"),
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
  whatsapp: z.string().trim().max(32).optional(),
  socialUrl: z.string().trim().max(500).optional(),
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

const slotUpgradeInput = z.object({
  accessToken: z.string().trim().min(4).max(32),
  planType: z.enum(["single", "bundle"]),
  receiptData: z.string().min(20).max(15_000_000),
  receiptFileName: z.string().trim().max(255).optional(),
  receiptMimeType: z.enum(["image/jpeg", "image/png"]),
  senderAccountName: z.string().trim().min(2).max(160),
  referenceNumber: z.string().trim().max(120).optional(),
});


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

function canManageSeller(user: { email?: string | null; id: number }, seller: { userId: number | null; userEmail: string | null }) {
  return user.email?.toLowerCase() === "dawoodrababh2008@gmail.com" || seller.userId === user.id || (!!user.email && seller.userEmail?.toLowerCase() === user.email.toLowerCase());
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
  catalog: router({ list: publicProcedure.query(() => listProducts()), announcement: publicProcedure.query(async () => { const settings = await getPlatformSettings(); return { text: settings?.announcementText ?? "", active: Boolean(settings?.isAnnouncementActive && settings?.announcementText) }; }) }),
  trial: router({
    getTrialStatus: publicProcedure.query(async () => {
      const settings = await getPlatformSettings();
      const used = await getActiveFreeTrialCount();
      const max = settings?.maxFreeTrials ?? 30;
      return { used, max, remaining: Math.max(0, max - used), isOpen: Boolean(settings?.isFreeTrialOpen && used < max) };
    }),
  }),
  seller: router({
    submitApplication: publicProcedure.input(applicationInput).mutation(async ({ input, ctx }) => {
      const isFreeTrial = input.planType === "free_trial";
      if (!input.whatsapp?.trim() && !input.socialUrl?.trim()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "يرجى إدخال رقم واتساب أو رابط حساب إنستغرام/فيسبوك للتواصل" });
      }
      if (!isFreeTrial && !input.senderAccountName?.trim()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "اسم صاحب الحساب المحوّل إجباري للباقة المدفوعة" });
      }
      if (!isFreeTrial && !input.receiptData) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "يرجى رفع صورة إيصال التحويل للباقة المدفوعة" });
      }
      if (isFreeTrial) {
        const settings = await getPlatformSettings();
        const used = await getActiveFreeTrialCount();
        if (!settings?.isFreeTrialOpen || used >= (settings?.maxFreeTrials ?? 30)) {
          throw new TRPCError({ code: "PRECONDITION_FAILED", message: "اكتملت المقاعد المجانية أو تم إغلاق التسجيل حالياً" });
        }
      }
      let receiptUrl: string | undefined;
      if (!isFreeTrial && input.receiptData) {
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
        userId: ctx.user?.id,
        userEmail: ctx.user?.email ?? undefined,
        fullName: input.fullName,
        projectName: input.projectName,
        whatsapp: input.whatsapp?.trim() || undefined,
        socialUrl: input.socialUrl?.trim() || undefined,
        category: input.category,
        description: input.description,
        planType: input.planType,
        receiptUrl: receiptUrl ?? "",
        senderAccountName: isFreeTrial ? "" : input.senderAccountName!,
        referenceNumber: input.referenceNumber,
        trialEndsAt: isFreeTrial ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined,
      } as Parameters<typeof createSellerApplication>[0]);
    }),
    loginWithAccount: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "يرجى تسجيل الدخول أولاً" });
      const isOwner = ctx.user.email?.toLowerCase() === "dawoodrababh2008@gmail.com";
      const seller = isOwner ? await ensureOwnerSellerApplication({ userId: ctx.user.id, email: ctx.user.email!, fullName: ctx.user.name ?? undefined }) : await getSellerApplicationByAccount(ctx.user.id, ctx.user.email ?? undefined);
      if (!seller || seller.status !== "approved" || !seller.accessToken) {
        throw new TRPCError({ code: "NOT_FOUND", message: "لا يوجد متجر مفعّل مرتبط بهذا الحساب" });
      }
      return seller;
    }),
    myApplication: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "يرجى تسجيل الدخول أولاً" });
      return getSellerApplicationByAccount(ctx.user.id, ctx.user.email ?? undefined);
    }),
    login: protectedProcedure.input(z.object({ accessToken: z.string().trim().min(4).max(32) })).query(async ({ input, ctx }) => {
      const seller = await getSellerApplicationByToken(input.accessToken.toUpperCase());
      if (!seller || seller.status !== "approved") throw new TRPCError({ code: "UNAUTHORIZED", message: "رمز الدخول غير صحيح أو لم تتم الموافقة على الطلب بعد" });
      if (!canManageSeller(ctx.user, seller)) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية إدارة هذا المتجر" });
      return seller;
    }),
    updateProfile: protectedProcedure.input(profileInput).mutation(async ({ input, ctx }) => {
      const seller = await getSellerApplicationByToken(input.accessToken.toUpperCase());
      if (!seller || seller.status !== "approved") throw new TRPCError({ code: "UNAUTHORIZED", message: "انتهت صلاحية جلسة البائع" });
      if (!canManageSeller(ctx.user, seller)) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية إدارة هذا المتجر" });
      if (!input.whatsapp?.trim() && !input.socialUrl?.trim()) throw new TRPCError({ code: "BAD_REQUEST", message: "يرجى إدخال رقم واتساب أو رابط حساب إنستغرام/فيسبوك للتواصل" });
      return updateSellerApplicationProfile({ id: seller.id, projectName: input.projectName, whatsapp: input.whatsapp?.trim() || undefined, socialUrl: input.socialUrl?.trim() || undefined, category: input.category, description: input.description });
    }),
    createProduct: protectedProcedure.input(productInput).mutation(async ({ input, ctx }) => {
      const seller = await getSellerApplicationByToken(input.accessToken.toUpperCase());
      if (!seller || seller.status !== "approved") throw new TRPCError({ code: "UNAUTHORIZED", message: "انتهت صلاحية جلسة البائع" });
      if (!canManageSeller(ctx.user, seller)) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية إدارة هذا المتجر" });
      const stats = await getSellerProductStats(seller.id);
      if (stats.productCount >= seller.maxProducts) throw new TRPCError({ code: "PRECONDITION_FAILED", message: `وصل متجرك إلى الحد الأقصى من المنتجات (${seller.maxProducts}). اطلب زيادة السعة من لوحة المتجر.` });
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
      const productId = await createProduct({ sellerApplicationId: seller.id, name: input.name, shortDescription: input.shortDescription, description: input.description, price: input.price, seller: seller.projectName, sellerPhone: seller.whatsapp ?? undefined, category: input.category, imageUrl, imageKey });
      if (uploadedFile && imageKey) await createMediaFile({ productId, storageKey: imageKey, url: imageUrl, ...uploadedFile });
      return { id: String(productId), imageUrl };
    }),
    likeProduct: publicProcedure.input(z.object({ productId: z.number().int().positive() })).mutation(({ input }) => incrementProductMetric(input.productId, "likesCount")),
    trackWhatsappClick: publicProcedure.input(z.object({ productId: z.number().int().positive() })).mutation(({ input }) => incrementProductMetric(input.productId, "whatsappClicks")),
    productStats: protectedProcedure.input(z.object({ accessToken: z.string().trim().min(4).max(32) })).query(async ({ input, ctx }) => {
      const seller = await getSellerApplicationByToken(input.accessToken.toUpperCase());
      if (!seller || seller.status !== "approved") throw new TRPCError({ code: "UNAUTHORIZED", message: "انتهت صلاحية جلسة البائع" });
      if (!canManageSeller(ctx.user, seller)) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية إدارة هذا المتجر" });
      return { maxProducts: seller.maxProducts, ...(await getSellerProductStats(seller.id)) };
    }),
    requestSlotUpgrade: protectedProcedure.input(slotUpgradeInput).mutation(async ({ input, ctx }) => {
      const seller = await getSellerApplicationByToken(input.accessToken.toUpperCase());
      if (!seller || seller.status !== "approved") throw new TRPCError({ code: "UNAUTHORIZED", message: "انتهت صلاحية جلسة البائع" });
      if (!canManageSeller(ctx.user, seller)) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية إدارة هذا المتجر" });
      const parsed = parseBase64Data(input.receiptData);
      const buffer = Buffer.from(parsed.base64, "base64");
      validateReceiptUpload(input.receiptMimeType, buffer.length);
      const uploaded = await storagePutReceipt(`upgrade-${seller.id}-${randomUUID()}`, buffer, input.receiptMimeType);
      const requestedSlots = input.planType === "single" ? 1 : 5;
      return createSlotUpgradeRequest({ sellerApplicationId: seller.id, planType: input.planType, requestedSlots, amount: input.planType === "single" ? "1" : "5", receiptUrl: uploaded.url, senderAccountName: input.senderAccountName, referenceNumber: input.referenceNumber });
    }),
  }),
  admin: router({
    applications: adminProcedure.input(z.object({})).query(async ({ input }) => {
      return listSellerApplications();
    }),
    overview: adminProcedure.input(z.object({})).query(async ({ input }) => { return getAdminOverview(); }),
    products: adminProcedure.input(z.object({})).query(async ({ input }) => { return listAdminProducts(); }),
    setFeatured: adminProcedure.input(z.object({ id: z.number().int().positive(), isFeatured: z.boolean() })).mutation(async ({ input }) => { return setProductFeatured(input.id, input.isFeatured); }),
    deleteProduct: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { return deleteProduct(input.id); }),
    renewSeller: adminProcedure.input(z.object({ id: z.number().int().positive(), days: z.number().int().min(1).max(365).default(30) })).mutation(async ({ input }) => { return renewSeller(input.id, input.days); }),
    suspendSeller: adminProcedure.input(z.object({ id: z.number().int().positive(), suspended: z.boolean() })).mutation(async ({ input }) => { return setSellerSuspended(input.id, input.suspended); }),
    slotUpgradeRequests: adminProcedure.input(z.object({})).query(async ({ input }) => {
      return listSlotUpgradeRequests();
    }),
    decideSlotUpgrade: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["approved", "rejected"]) })).mutation(async ({ input }) => {
      return decideSlotUpgradeRequest(input.id, input.status);
    }),
    trialSettings: adminProcedure.input(z.object({})).query(async ({ input }) => {
      const settings = await getPlatformSettings();
      return { ...settings, used: await getActiveFreeTrialCount() };
    }),
    updateTrialSettings: adminProcedure.input(z.object({ maxFreeTrials: z.number().int().min(0).max(10000).optional(), isFreeTrialOpen: z.boolean().optional(), announcementText: z.string().max(1000).nullable().optional(), isAnnouncementActive: z.boolean().optional() })).mutation(async ({ input }) => {
      if (input.maxFreeTrials !== undefined) {
        const used = await getActiveFreeTrialCount();
        if (input.maxFreeTrials < used) throw new TRPCError({ code: "BAD_REQUEST", message: `لا يمكن ضبط الحد الأقصى أقل من المقاعد المستخدمة (${used})` });
      }
      const changes = input;
      return updatePlatformSettings(changes);
    }),
    grantFreeTrial: adminProcedure.input(z.object({ projectName: z.string().trim().min(2).max(160), whatsapp: z.string().trim().min(8).max(32), userEmail: z.string().email().optional() })).mutation(async ({ input }) => {
      const settings = await getPlatformSettings();
      const used = await getActiveFreeTrialCount();
      if (used >= (settings?.maxFreeTrials ?? 30)) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "لا توجد مقاعد مجانية متاحة" });
      const accessToken = makeAccessToken();
      return createDirectFreeTrial({ projectName: input.projectName, whatsapp: input.whatsapp, userEmail: input.userEmail, accessToken, trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
    }),
    decideApplication: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["approved", "rejected"]) })).mutation(async ({ input }) => {
      const current = await getSellerApplicationById(input.id);
      if (!current) throw new TRPCError({ code: "NOT_FOUND", message: "طلب البائع غير موجود" });
      if (input.status === "approved" && current.status !== "approved") {
        if (current.planType === "free_trial") {
          const settings = await getPlatformSettings();
          const used = await getActiveFreeTrialCount();
          if (used >= (settings?.maxFreeTrials ?? 30)) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "تم بلوغ الحد الأقصى للمقاعد المجانية" });
        } else {
          const activeCount = await getActiveSellerCount();
          if (activeCount >= MAX_ACTIVE_SELLERS) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "تم بلوغ الحد الأقصى: 30 متجراً نشطاً" });
          if (!current.receiptUrl || !current.senderAccountName) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن التفعيل دون إيصال واسم صاحب الحساب" });
        }
      }
      const end = input.status === "approved" ? new Date(Date.now() + (current.planType === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000) : undefined;
      return decideSellerApplication(input.id, input.status, input.status === "approved" ? makeAccessToken() : undefined, input.status === "approved" && current.planType === "free_trial" ? end : undefined, end);
    }),
  }),
});

export type AppRouter = typeof appRouter;
