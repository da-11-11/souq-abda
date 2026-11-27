const VISITOR_KEY_STORAGE = "souq-abda-whatsapp-visitor-key";

export function getWhatsappVisitorKey(): string {
  if (typeof window === "undefined") return "server-render-visitor-key";
  const existing = window.localStorage.getItem(VISITOR_KEY_STORAGE);
  if (existing && existing.length >= 16) return existing;
  const key = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(VISITOR_KEY_STORAGE, key);
  return key;
}
