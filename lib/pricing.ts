import { CATALOG } from "./catalog.js";

type Slot = keyof typeof CATALOG.components;
const SLOTS = Object.keys(CATALOG.components) as Slot[];

export type PricedItem = {
  orderType: "prebuilt" | "custom";
  buildName: string;
  unitPrice: number;
  quantity: number;
  config: Record<string, string>;
  description: string;
};

export const MAX_QTY = 5;
export const MAX_LINES = 10;

/** Prices a cart line using only the server-side catalog. Throws a user-facing message on invalid input. */
export function priceItem(item: any): PricedItem {
  const quantity = Number.isInteger(item?.qty) && item.qty >= 1 && item.qty <= MAX_QTY ? item.qty : NaN;
  if (Number.isNaN(quantity)) throw new Error(`Quantity must be between 1 and ${MAX_QTY}`);

  if (item.type === "prebuilt") {
    const pb = CATALOG.prebuilts.find((p) => p.id === item.id);
    if (!pb) throw new Error("One of the prebuilts in your cart is no longer available");
    return { orderType: "prebuilt", buildName: pb.name, unitPrice: pb.price, quantity, config: { ...pb.config }, description: pb.gpu_chipset };
  }

  if (item.type === "custom") {
    const base = CATALOG.base_models.find((m) => m.id === item.base_model);
    if (!base) throw new Error("Unknown base model in cart");
    const config: Record<string, string> = {};
    const names: string[] = [];
    let unitPrice: number = base.base_price;
    for (const slot of SLOTS) {
      const chosen = item.config?.[slot] ?? base.defaults[slot];
      const opt = CATALOG.components[slot].find((o) => o.id === chosen);
      if (!opt) throw new Error(`Invalid ${slot} selection`);
      config[slot] = opt.id;
      unitPrice += opt.price;
      names.push(opt.name);
    }
    return { orderType: "custom", buildName: `${base.name} (Custom)`, unitPrice, quantity, config, description: names.join(" · ") };
  }

  throw new Error("Unknown item in cart");
}
