import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  type InsertUser,
  mediaFiles,
  products,
  sellerApplications,
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
  fullName: string;
  projectName: string;
  whatsapp: string;
  category: string;
  description: string;
}) {
  const db = await requireDb();
  const result = await db.insert(sellerApplications).values(input);
  return Number((result as unknown as [{ insertId: number }])[0]?.insertId);
}

export async function listSellerApplications() {
  const db = await requireDb();
  return db.select().from(sellerApplications).orderBy(desc(sellerApplications.createdAt));
}

export async function getSellerApplicationByToken(accessToken: string) {
  const db = await requireDb();
  const result = await db.select().from(sellerApplications).where(eq(sellerApplications.accessToken, accessToken)).limit(1);
  return result[0];
}

export async function decideSellerApplication(id: number, status: "approved" | "rejected", accessToken?: string) {
  const db = await requireDb();
  await db.update(sellerApplications).set({ status, accessToken: status === "approved" ? accessToken ?? null : null }).where(eq(sellerApplications.id, id));
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
  const rows = await db.select().from(products).orderBy(desc(products.createdAt));
  return rows.map((row) => ({
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
  }));
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
