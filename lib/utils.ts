export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDiscountPercent(mrp: number, price: number): number {
  return Math.round(((mrp - price) / mrp) * 100);
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateOrderNumber(): string {
  const prefix = "RR";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export const FREE_SHIPPING_THRESHOLD = 499;

export function getSizeAdjustment(sizeVal: string | undefined): number {
  if (!sizeVal) return 0;
  const match = sizeVal.match(/\d+/);
  if (match) {
    const sizeNum = parseInt(match[0], 10);
    return (sizeNum - 1) * 100;
  }
  return 0;
}

