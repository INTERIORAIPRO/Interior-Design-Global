export type CartProduct = {
  id: string;
  name: string;
  price: number;
  currency: string;
  image2d: string;
  accentColor: string;
  affiliateUrl: string;
};

export type CartLine = CartProduct & {
  quantity: number;
  setId: string;
};

export type DesignCart = {
  lines: CartLine[];
  lastSetId: string | null;
};

const STORAGE_KEY = "idg-design-cart";
const EVENT = "idg-cart-updated";

export const emptyCart = (): DesignCart => ({
  lines: [],
  lastSetId: null,
});

export function cartCount(cart: DesignCart) {
  return cart.lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function cartTotal(cart: DesignCart) {
  return cart.lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
}

export function readCart(): DesignCart {
  if (typeof window === "undefined") return emptyCart();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyCart();
    const parsed = JSON.parse(raw) as DesignCart;
    if (!parsed || !Array.isArray(parsed.lines)) return emptyCart();
    return parsed;
  } catch {
    return emptyCart();
  }
}

function writeCart(cart: DesignCart) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeCart(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function addRoomSet(products: CartProduct[]) {
  const cart = readCart();
  const setId = `set-${Date.now()}`;
  for (const product of products) {
    const existing = cart.lines.find((line) => line.id === product.id);
    if (existing) {
      existing.quantity += 1;
      existing.setId = setId;
      existing.affiliateUrl = product.affiliateUrl;
    } else {
      cart.lines.push({ ...product, quantity: 1, setId });
    }
  }
  cart.lastSetId = setId;
  writeCart(cart);
  return cart;
}

export function clearCart() {
  writeCart(emptyCart());
}
