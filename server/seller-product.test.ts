import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  createSellerApplication: vi.fn(),
  getSellerApplicationByToken: vi.fn(),
  createProduct: vi.fn(),
  createMediaFile: vi.fn(),
  listProducts: vi.fn(),
  listSellerApplications: vi.fn(),
  decideSellerApplication: vi.fn(),
  updateSellerApplicationProfile: vi.fn(),
  getSellerProductStats: vi.fn(),
  getPlatformSettings: vi.fn(),
  getActiveFreeTrialCount: vi.fn(),
}));

const storageMocks = vi.hoisted(() => ({
  storagePut: vi.fn(),
  storagePutReceipt: vi.fn(),
  validateReceiptUpload: vi.fn(),
}));

vi.mock("./db", () => dbMocks);
vi.mock("./storage", () => storageMocks);

import { appRouter } from "./routers";

const context = {
  user: null,
  req: {} as never,
  res: { clearCookie: vi.fn() } as never,
};

const sellerContext = {
  ...context,
  user: { id: 99, email: "seller@example.com", name: "أحمد محمد" },
};

const approvedSeller = {
  id: 7,
  userId: 99,
  userEmail: "seller@example.com",
  fullName: "أحمد محمد",
  projectName: "مخبز السعادة",
  whatsapp: "962790000000",
  category: "food",
  description: "منتجات منزلية طازجة مصنوعة بعناية.",
  status: "approved" as const,
  accessToken: "AB123456",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("seller marketplace procedures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.createSellerApplication.mockResolvedValue(12);
    dbMocks.getSellerApplicationByToken.mockResolvedValue(approvedSeller);
    dbMocks.createProduct.mockResolvedValue(44);
    dbMocks.createMediaFile.mockResolvedValue(undefined);
    dbMocks.getSellerProductStats.mockResolvedValue({ productCount: 0, whatsappClicks: 0, likesCount: 0, products: [] });
    storageMocks.storagePut.mockResolvedValue({ key: "products/7/item.png", url: "/manus-storage/products/7/item.png" });
    storageMocks.storagePutReceipt.mockResolvedValue({ url: "/manus-storage/receipts/item.png" });
  });

  it("persists seller applications through the server router", async () => {
    const caller = appRouter.createCaller(context);
    const result = await caller.seller.submitApplication({
      fullName: "أحمد محمد",
      projectName: "مخبز السعادة",
      whatsapp: "962790000000",
      category: "food",
      description: "منتجات منزلية طازجة مصنوعة بعناية.",
      planType: "monthly",
      senderAccountName: "أحمد محمد",
      receiptData: "data:image/png;base64,aGk=",
      receiptMimeType: "image/png",
    });

    expect(result).toBe(12);
    expect(dbMocks.createSellerApplication).toHaveBeenCalledOnce();
  });

  it("rejects invalid seller tokens and returns approved sellers", async () => {
    const caller = appRouter.createCaller(sellerContext);
    expect(await caller.seller.login({ accessToken: "AB123456" })).toMatchObject({ id: 7, status: "approved" });

    dbMocks.getSellerApplicationByToken.mockResolvedValueOnce(undefined);
    await expect(caller.seller.login({ accessToken: "WRONG" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("uploads product images and stores only the storage reference with the product", async () => {
    const caller = appRouter.createCaller(sellerContext);
    const result = await caller.seller.createProduct({
      accessToken: "AB123456",
      name: "كيكة منزلية",
      shortDescription: "كيكة طازجة للمناسبات.",
      description: "كيكة منزلية تُحضّر عند الطلب بمكونات مختارة بعناية.",
      price: "18 د.أ",
      category: "food",
      imageData: "data:image/png;base64,aGk=",
      imageFileName: "item.png",
      imageMimeType: "image/png",
    });

    expect(result).toEqual({ id: "44", imageUrl: "/manus-storage/products/7/item.png" });
    expect(storageMocks.storagePut).toHaveBeenCalledOnce();
    expect(dbMocks.createProduct).toHaveBeenCalledWith(expect.objectContaining({ imageKey: "products/7/item.png" }));
    expect(dbMocks.createMediaFile).toHaveBeenCalledWith(expect.objectContaining({ productId: 44, storageKey: "products/7/item.png" }));
  });

  it("protects the admin application list with the configured password", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.admin.applications({ password: "wrong" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
