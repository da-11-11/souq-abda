import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const platformSettings = mysqlTable("platform_settings", {
  id: int("id").autoincrement().primaryKey(),
  maxFreeTrials: int("maxFreeTrials").default(30).notNull(),
  isFreeTrialOpen: boolean("isFreeTrialOpen").default(true).notNull(),
  announcementText: text("announcementText"),
  isAnnouncementActive: boolean("isAnnouncementActive").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const sellerApplications = mysqlTable("seller_applications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  userEmail: varchar("userEmail", { length: 320 }),
  fullName: varchar("fullName", { length: 160 }).notNull(),
  projectName: varchar("projectName", { length: 160 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 32 }),
  socialUrl: text("socialUrl"),
  category: varchar("category", { length: 64 }).notNull(),
  description: text("description").notNull(),
  planType: mysqlEnum("planType", ["free_trial", "monthly", "yearly"]).default("monthly").notNull(),
  receiptUrl: text("receiptUrl").notNull(),
  senderAccountName: varchar("senderAccountName", { length: 160 }).notNull(),
  referenceNumber: varchar("referenceNumber", { length: 120 }),
  trialEndsAt: timestamp("trialEndsAt"),
  expiresAt: timestamp("expiresAt"),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "suspended", "expired"])
    .default("pending")
    .notNull(),
  accessToken: varchar("accessToken", { length: 32 }).unique(),
  maxProducts: int("maxProducts").default(5).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const slotUpgradeRequests = mysqlTable("slot_upgrade_requests", {
  id: int("id").autoincrement().primaryKey(),
  sellerApplicationId: int("sellerApplicationId").notNull(),
  planType: mysqlEnum("planType", ["single", "bundle"]).notNull(),
  requestedSlots: int("requestedSlots").notNull(),
  amount: varchar("amount", { length: 32 }).notNull(),
  receiptUrl: text("receiptUrl").notNull(),
  senderAccountName: varchar("senderAccountName", { length: 160 }).notNull(),
  referenceNumber: varchar("referenceNumber", { length: 120 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  sellerApplicationId: int("sellerApplicationId").notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  shortDescription: varchar("shortDescription", { length: 320 }).notNull(),
  description: text("description").notNull(),
  price: varchar("price", { length: 64 }).notNull(),
  seller: varchar("seller", { length: 160 }).notNull(),
  sellerPhone: varchar("sellerPhone", { length: 32 }),
  category: varchar("category", { length: 64 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 512 }),
  isVip: boolean("isVip").default(false).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  whatsappClicks: int("whatsappClicks").default(0).notNull(),
  likesCount: int("likesCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const whatsappClickEvents = mysqlTable("whatsapp_click_events", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  identityKey: varchar("identityKey", { length: 191 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  productIdentityUnique: uniqueIndex("whatsapp_click_events_product_identity_unique").on(table.productId, table.identityKey),
}));

export const mediaFiles = mysqlTable("media_files", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  storageKey: varchar("storageKey", { length: 512 }).notNull().unique(),
  url: text("url").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  sizeBytes: int("sizeBytes").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type PlatformSetting = typeof platformSettings.$inferSelect;
export type InsertPlatformSetting = typeof platformSettings.$inferInsert;
export type SellerApplication = typeof sellerApplications.$inferSelect;
export type InsertSellerApplication = typeof sellerApplications.$inferInsert;
export type SlotUpgradeRequest = typeof slotUpgradeRequests.$inferSelect;
export type InsertSlotUpgradeRequest = typeof slotUpgradeRequests.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type WhatsappClickEvent = typeof whatsappClickEvents.$inferSelect;
export type InsertWhatsappClickEvent = typeof whatsappClickEvents.$inferInsert;
export type MediaFile = typeof mediaFiles.$inferSelect;
export type InsertMediaFile = typeof mediaFiles.$inferInsert;
