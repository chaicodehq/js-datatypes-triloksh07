/**
 * 🍕 Zomato Order Builder
 *
 * Zomato jaisa order summary banana hai! Cart mein items hain (with quantity
 * aur addons), ek optional coupon code hai, aur tujhe final bill banana hai
 * with itemwise breakdown, taxes, delivery fee, aur discount.
 *
 * Rules:
 **   - cart is array of items:
 **     [{ name: "Butter Paneer", price: 350, qty: 2, addons: ["Extra Butter:50", "Naan:40"] }, ...]
 **   - Each addon string format: "AddonName:Price" (split by ":" to get price)
 **   - Per item total = (price + sum of addon prices) * qty
 **   - Calculate:
 **     - items: array of { name, qty, basePrice, addonTotal, itemTotal }
 **     - subtotal: sum of all itemTotals
 **     - deliveryFee: Rs 30 if subtotal < 500, Rs 15 if 500-999, FREE (0) if >= 1000
 **     - gst: 5% of subtotal, rounded to 2 decimal places parseFloat(val.toFixed(2))
 **     - discount: based on coupon (see below)
 **     - grandTotal: subtotal + deliveryFee + gst - discount (minimum 0, use Math.max)
 **     - Round grandTotal to 2 decimal places
 *
 *   Coupon codes (case-insensitive):
 *     - "FIRST50"  => 50% off subtotal, max Rs 150 (use Math.min)
 *     - "FLAT100"  => flat Rs 100 off
 *     - "FREESHIP" => delivery fee becomes 0 (discount = original delivery fee value)
 *     - null/undefined/invalid string => no discount (
 *
 *   - Items with qty <= 0 ko skip karo
 *   - Hint: Use map(), reduce(), filter(), split(), parseFloat(),
 *     toFixed(), Math.max(), Math.min(), toLowerCase()
 *
 * Validation:
 *   - Agar cart array nahi hai ya empty hai, return null
 *
 * @param {Array<{ name: string, price: number, qty: number, addons?: string[] }>} cart
 * @param {string} [coupon] - Optional coupon code
 * @returns {{ items: Array<{ name: string, qty: number, basePrice: number, addonTotal: number, itemTotal: number }>, subtotal: number, deliveryFee: number, gst: number, discount: number, grandTotal: number } | null}
 *
 * @example
 *   buildZomatoOrder([{ name: "Biryani", price: 300, qty: 1, addons: ["Raita:30"] }], "FLAT100")
 *   // subtotal: 330, deliveryFee: 30, gst: 16.5, discount: 100
 *   // grandTotal: 330 + 30 + 16.5 - 100 = 276.5
 *
 *   buildZomatoOrder([{ name: "Pizza", price: 500, qty: 2, addons: [] }], "FIRST50")
 *   // subtotal: 1000, deliveryFee: 0, gst: 50, discount: min(500, 150) = 150
 *   // grandTotal: 1000 + 0 + 50 - 150 = 900
 */
export function buildZomatoOrder(cart, coupon) {
  if (!Array.isArray(cart) || cart.length <= 0 || cart === null) return null;

  const couponCodes = {
    "FIRST50": 50,
    "FLAT100": 100,
    "FREESHIP": 0
  };
  const maxDiscount = 150;

  // Each item should include { name, qty, basePrice, addonTotal, itemTotal } 
  const items = cart.filter(e => e.qty > 0).map(({ name, price, qty, addons }) => {

    const addOnPrice = (addons || []).map(addOn => Number(addOn.split(":")[1]));

    const sumOfAddOns = addOnPrice.reduce((acc, price) => (acc + price), 0);

    const itemTotal = (price + Math.max(0, sumOfAddOns)) * qty;

    return { name, qty, basePrice: price, addonTotal: sumOfAddOns, itemTotal }
  });

  const subtotal = items.reduce((acc, item) => (acc + item.itemTotal), 0);
  let deliveryFee = subtotal >= 1000 ? 0 : subtotal >= 500 ? 15 : 30;
  const gst = parseFloat((subtotal * 5 / 100).toFixed(2));

  let discount = 0;
  const normalizeCoupon = coupon ? coupon.toUpperCase() : "";
  if (normalizeCoupon === "FIRST50") {
    discount = Math.min(maxDiscount, ((subtotal * couponCodes[normalizeCoupon]) / 100));
  }
  if (normalizeCoupon === "FLAT100") {
    discount = couponCodes[normalizeCoupon];
  }
  if (normalizeCoupon === "FREESHIP") {
    discount = deliveryFee;
    deliveryFee = 0;
  }

  const total = Number((subtotal + deliveryFee + gst - Math.max(0, discount)).toFixed(2));
  const grandTotal = Math.max(0, total);

  return {
    items,
    subtotal,
    deliveryFee,
    gst,
    discount,
    grandTotal,
  }
}
