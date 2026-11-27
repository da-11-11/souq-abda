import { and, count, desc, eq, gt, ne, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  type InsertUser,
  mediaFiles,
  platformSettings,
  products,
  sellerApplications,
  slotUpgradeRequests,
  type User,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً");
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function createSellerApplication(input: {
  userId?: number;
  userEmail?: string;
  fullName: string;
  projectName: string;
  whatsapp: string;
  category: string;
  description: string;
  planType: "free_trial" | "monthly" | "yearly";
  receiptUrl: string;
  senderAccountName: string;
  referenceNumber?: string;
  trialEndsAt?: Date;
}) {
  const db = await requireDb();
  const result = await db.insert(sellerApplications).values({
    ...input,
    referenceNumber: input.referenceNumber || null,
  });
  return Number((result as unknown as [{ insertId: number }])[0]?.insertId);
}

const DEFAULT_SETTINGS_ID = 1;

export async function getPlatformSettings() {
  const db = await requireDb();
  const existing = await db.select().from(platformSettings).where(eq(platformSettings.id, DEFAULT_SETTINGS_ID)).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(platformSettings).values({ id: DEFAULT_SETTINGS_ID, maxFreeTrials: 30, isFreeTrialOpen: true, announcementText: null, isAnnouncementActive: false });
  const created = await db.select().from(platformSettings).where(eq(platformSettings.id, DEFAULT_SETTINGS_ID)).limit(1);
  return created[0];
}

export async function updatePlatformSettings(input: { maxFreeTrials?: number; isFreeTrialOpen?: boolean; announcementText?: string | null; isAnnouncementActive?: boolean }) {
  const db = await requireDb();
  await getPlatformSettings();
  await db.update(platformSettings).set(input).where(eq(platformSettings.id, DEFAULT_SETTINGS_ID));
  return getPlatformSettings();
}

export async function getActiveFreeTrialCount() {
  const db = await requireDb();
  const result = await db
    .select({ value: count() })
    .from(sellerApplications)
    .where(and(eq(sellerApplications.status, "approved"), eq(sellerApplications.planType, "free_trial"), gt(sellerApplications.trialEndsAt, new Date())));
  return Number(result[0]?.value ?? 0);
}

export async function createDirectFreeTrial(input: { projectName: string; whatsapp: string; accessToken: string; trialEndsAt: Date; userId?: number; userEmail?: string }) {
  const db = await requireDb();
  const result = await db.insert(sellerApplications).values({
    userId: input.userId,
    userEmail: input.userEmail,
    fullName: input.projectName,
    projectName: input.projectName,
    whatsapp: input.whatsapp,
    category: "other",
    description: "تجربة مجانية ممنوحة مباشرة من الإدارة",
    planType: "free_trial",
    receiptUrl: "",
    senderAccountName: "تجربة مجانية",
    trialEndsAt: input.trialEndsAt,
    status: "approved",
    accessToken: input.accessToken,
  });
  return getSellerApplicationById(Number((result as unknown as [{ insertId: number }])[0]?.insertId));
}

export async function listSellerApplications() {
  const db = await requireDb();
  return db.select().from(sellerApplications).orderBy(desc(sellerApplications.createdAt));
}

export async function getSellerApplicationByToken(accessToken: string) {
  const db = await requireDb();
  const result = await db.select().from(sellerApplications).where(eq(sellerApplications.accessToken, accessToken)).limit(1);
  const seller = result[0];
  if (seller?.status === "approved" && seller.planType === "free_trial" && seller.trialEndsAt && seller.trialEndsAt <= new Date()) {
    await db.update(sellerApplications).set({ status: "expired" }).where(eq(sellerApplications.id, seller.id));
    return { ...seller, status: "expired" as const };
  }
  return seller;
}

export async function getSellerApplicationByAccount(userId: number, email?: string) {
  const db = await requireDb();
  const conditions = [eq(sellerApplications.userId, userId)];
  if (email) conditions.push(eq(sellerApplications.userEmail, email));
  const result = await db.select().from(sellerApplications).where(or(...conditions)).orderBy(desc(sellerApplications.createdAt)).limit(1);
  const seller = result[0];
  if (seller?.status === "approved" && seller.planType === "free_trial" && seller.trialEndsAt && seller.trialEndsAt <= new Date()) {
    await db.update(sellerApplications).set({ status: "expired" }).where(eq(sellerApplications.id, seller.id));
    return { ...seller, status: "expired" as const };
  }
  return seller;
}

export async function getActiveSellerCount() {
  const db = await requireDb();
  const result = await db.select({ value: count() }).from(sellerApplications).where(and(eq(sellerApplications.status, "approved"), or(ne(sellerApplications.planType, "free_trial"), gt(sellerApplications.trialEndsAt, new Date()))));
  return Number(result[0]?.value ?? 0);
}

export async function decideSellerApplication(id: number, status: "approved" | "rejected", accessToken?: string, trialEndsAt?: Date, expiresAt?: Date) {
  const db = await requireDb();
  await db.update(sellerApplications).set({ status, accessToken: status === "approved" ? accessToken ?? null : null, trialEndsAt: status === "approved" ? trialEndsAt ?? null : null, expiresAt: status === "approved" ? expiresAt ?? null : null }).where(eq(sellerApplications.id, id));
  return getSellerApplicationById(id);
}

export async function updateSellerApplicationProfile(input: {
  id: number;
  projectName: string;
  whatsapp: string;
  category: string;
  description: string;
}) {
  const db = await requireDb();
  await db.update(sellerApplications).set({ projectName: input.projectName, whatsapp: input.whatsapp, category: input.category, description: input.description }).where(eq(sellerApplications.id, input.id));
  return getSellerApplicationById(input.id);
}

export async function getSellerApplicationById(id: number) {
  const db = await requireDb();
  const result = await db.select().from(sellerApplications).where(eq(sellerApplications.id, id)).limit(1);
  return result[0];
}

export async function listProducts() {
  const db = await requireDb();
  const rows = await db.select({ product: products }).from(products).innerJoin(sellerApplications, eq(products.sellerApplicationId, sellerApplications.id)).where(eq(sellerApplications.status, "approved")).orderBy(desc(products.isFeatured), desc(products.whatsappClicks), desc(products.createdAt));
  return rows.map(({ product: row }) => ({
    id: String(row.id),
    name: row.name,
    shortDescription: row.shortDescription,
    description: row.description,
    price: row.price,
    seller: row.seller,
    sellerPhone: row.sellerPhone,
    category: row.category,
    image: row.imageUrl,
    isVIP: row.isVip,
    isFeatured: row.isFeatured,
    whatsappClicks: row.whatsappClicks,
    likesCount: row.likesCount,
  }));
}

export async function getSellerProductStats(sellerApplicationId: number) {
  const db = await requireDb();
  const rows = await db.select({ id: products.id, whatsappClicks: products.whatsappClicks, likesCount: products.likesCount }).from(products).where(eq(products.sellerApplicationId, sellerApplicationId));
  return {
    productCount: rows.length,
    whatsappClicks: rows.reduce((total, row) => total + row.whatsappClicks, 0),
    likesCount: rows.reduce((total, row) => total + row.likesCount, 0),
    products: rows,
  };
}

export async function getAdminOverview() {
  const db = await requireDb();
  const [sellerRows, productRows, revenueRows] = await Promise.all([
    db.select({ value: count() }).from(sellerApplications).where(eq(sellerApplications.status, "approved")),
    db.select({ productCount: count(), whatsappClicks: sql<number>`coalesce(sum(${products.whatsappClicks}), 0)`, likesCount: sql<number>`coalesce(sum(${products.likesCount}), 0)` }).from(products),
    db.select({ revenue: sql<number>`coalesce(sum(case when ${sellerApplications.planType} = 'yearly' then 100 when ${sellerApplications.planType} = 'monthly' then 10 else 0 end), 0)` }).from(sellerApplications).where(eq(sellerApplications.status, "approved")),
  ]);
  return { activeSellers: Number(sellerRows[0]?.value ?? 0), productCount: Number(productRows[0]?.productCount ?? 0), whatsappClicks: Number(productRows[0]?.whatsappClicks ?? 0), likesCount: Number(productRows[0]?.likesCount ?? 0), revenue: Number(revenueRows[0]?.revenue ?? 0) };
}

export async function listAdminProducts() {
  const db = await requireDb();
  return db.select().from(products).orderBy(desc(products.whatsappClicks), desc(products.createdAt));
}

export async function setProductFeatured(id: number, isFeatured: boolean) {
  const db = await requireDb();
  await db.update(products).set({ isFeatured }).where(eq(products.id, id));
  return db.select().from(products).where(eq(products.id, id)).limit(1);
}

export async function deleteProduct(id: number) {
  const db = await requireDb();
  await db.delete(products).where(eq(products.id, id));
  return { success: true };
}

export async function renewSeller(id: number, days = 30) {
  const db = await requireDb();
  await db.update(sellerApplications).set({ status: "approved", expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000) }).where(eq(sellerApplications.id, id));
  return getSellerApplicationById(id);
}

export async function setSellerSuspended(id: number, suspended: boolean) {
  const db = await requireDb();
  await db.update(sellerApplications).set({ status: suspended ? "suspended" : "approved" }).where(eq(sellerApplications.id, id));
  return getSellerApplicationById(id);
}

export async function incrementProductMetric(productId: number, metric: "likesCount" | "whatsappClicks") {
  const db = await requireDb();
  if (metric === "likesCount") {
    await db.update(products).set({ likesCount: sql`${products.likesCount} + 1` }).where(eq(products.id, productId));
  } else {
    await db.update(products).set({ whatsappClicks: sql`${products.whatsappClicks} + 1` }).where(eq(products.id, productId));
  }
  const result = await db.select({ likesCount: products.likesCount, whatsappClicks: products.whatsappClicks }).from(products).where(eq(products.id, productId)).limit(1);
  return result[0];
}

export async function createProduct(input: {
  sellerApplicationId: number;
  name: string;
  shortDescription: string;
  description: string;
  price: string;
  seller: string;
  sellerPhone: string;
  category: string;
  imageUrl: string;
  imageKey?: string;
}) {
  const db = await requireDb();
  const result = await db.insert(products).values(input);
  return Number((result as unknown as [{ insertId: number }])[0]?.insertId);
}

export async function createMediaFile(input: {
  productId: number;
  storageKey: string;
  url: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}) {
  const db = await requireDb();
  await db.insert(mediaFiles).values(input);
}

export async function createSlotUpgradeRequest(input: {
  sellerApplicationId: number;
  planType: "single" | "bundle";
  requestedSlots: number;
  amount: string;
  receiptUrl: string;
  senderAccountName: string;
  referenceNumber?: string;
}) {
  const db = await requireDb();
  const result = await db.insert(slotUpgradeRequests).values({ ...input, referenceNumber: input.referenceNumber || null });
  return getSlotUpgradeRequestById(Number((result as unknown as [{ insertId: number }])[0]?.insertId));
}

export async function listSlotUpgradeRequests() {
  const db = await requireDb();
  return db.select().from(slotUpgradeRequests).orderBy(desc(slotUpgradeRequests.createdAt));
}

export async function getSlotUpgradeRequestById(id: number) {
  const db = await requireDb();
  const result = await db.select().from(slotUpgradeRequests).where(eq(slotUpgradeRequests.id, id)).limit(1);
  return result[0];
}

export async function decideSlotUpgradeRequest(id: number, status: "approved" | "rejected") {
  const db = await requireDb();
  const request = await getSlotUpgradeRequestById(id);
  if (!request) return undefined;
  await db.update(slotUpgradeRequests).set({ status }).where(eq(slotUpgradeRequests.id, id));
  if (status === "approved" && request.status !== "approved") {
    await db.update(sellerApplications).set({ maxProducts: sql`${sellerApplications.maxProducts} + ${request.requestedSlots}` }).where(eq(sellerApplications.id, request.sellerApplicationId));
  }
  return getSlotUpgradeRequestById(id);
}
