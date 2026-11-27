export function formatJordanWhatsappNumber(value: string | null | undefined): string | null {
  if (!value) return null;
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("07") && digits.length === 10) return `962${digits.slice(1)}`;
  if (digits.startsWith("7") && digits.length === 9) return `962${digits}`;
  return digits || null;
}

export function formatJordanianPrice(value: string | number | null | undefined): string {
  const raw = String(value ?? "").replace(/[^0-9,.-]/g, "").replace(",", ".");
  const amount = Number(raw);
  if (!Number.isFinite(amount)) return "0 د.أ";
  return `${Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(2)} د.أ`;
}
