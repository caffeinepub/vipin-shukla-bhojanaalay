import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  MapPin,
  MessageCircle,
  Minus,
  Package,
  Phone,
  Plus,
  Quote,
  ShoppingCart,
  Trash2,
  Utensils,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useId, useState } from "react";

const PHONE_TEL = "+919695613005";
const PHONE_DISPLAY = "+91-9695613005";
const WHATSAPP_NUMBER = "919695613005";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  desc: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "\u0915\u094d\u0930\u093f\u0938\u094d\u092a\u0940 \u0938\u092e\u094b\u0938\u093e",
    price: 18,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    desc: "\u0917\u0930\u092e\u093e\u0917\u0930\u092e, \u0915\u0941\u0930\u0915\u0941\u0930\u093e \u0938\u092e\u094b\u0938\u093e - \u0939\u0930\u0940 \u091a\u091f\u0928\u0940 \u0915\u0947 \u0938\u093e\u0925\u0964",
  },
  {
    id: 2,
    name: "\u0926\u0947\u0938\u0940 \u0918\u0940 \u091c\u0932\u0947\u092c\u0940",
    price: 130,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1606312619072-d5b539877e9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    desc: "\u0915\u0947\u0938\u0930\u093f\u092f\u093e, \u0915\u0941\u0930\u0915\u0941\u0930\u0940 \u091c\u0932\u0947\u092c\u0940 - \u0926\u0947\u0938\u0940 \u0918\u0940 \u092e\u0947\u0902 \u0924\u0932\u0940 (250 \u0917\u094d\u0930\u093e\u092e)\u0964",
  },
  {
    id: 3,
    name: "\u0935\u093f\u0936\u0947\u0937 \u0935\u0947\u091c \u0925\u093e\u0932\u0940",
    price: 140,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    desc: "2 \u0930\u094b\u091f\u0940, \u0938\u092c\u094d\u091c\u093c\u0940, \u0926\u093e\u0932 \u092e\u0916\u0928\u0940, \u091a\u093e\u0935\u0932, \u0938\u0932\u093e\u0926, \u092a\u093e\u092a\u0921\u093c, \u0905\u091a\u093e\u0930\u0964",
  },
  {
    id: 4,
    name: "\u091b\u094b\u0932\u0947 \u092d\u091f\u0942\u0930\u0947",
    price: 100,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1626132647523-66bc03b5e3a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    desc: "\u0926\u094b \u0928\u0930\u092e \u092d\u091f\u0942\u0930\u0947, \u092e\u0938\u093e\u0932\u0947\u0926\u093e\u0930 \u091b\u094b\u0932\u0947, \u092a\u094d\u092f\u093e\u091c-\u0928\u0940\u0902\u092c\u0942 \u0915\u0947 \u0938\u093e\u0925\u0964",
  },
  {
    id: 5,
    name: "\u0924\u0902\u0926\u0942\u0930\u0940 \u0930\u094b\u091f\u0940",
    price: 12,
    stock: 50,
    image:
      "https://images.unsplash.com/photo-1604909052743-94e838986d24?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    desc: "\u0924\u0902\u0926\u0942\u0930 \u092e\u0947\u0902 \u0938\u0947\u0902\u0915\u0940 \u0939\u0941\u0908 \u0917\u0947\u0939\u0942\u0902 \u0915\u0940 \u0930\u094b\u091f\u0940 - \u092e\u0915\u094d\u0916\u0928 \u0932\u0917\u093e \u0939\u0941\u0906\u0964",
  },
];

const FEATURES = [
  "\u0936\u0941\u0926\u094d\u0927 \u0936\u093e\u0915\u093e\u0939\u093e\u0930\u0940 (\u0915\u094b\u0908 \u0905\u0902\u0921\u093e \u0928\u0939\u0940\u0902)",
  "\u0926\u0947\u0938\u0940 \u0918\u0940 \u0915\u093e \u0939\u0940 \u092a\u094d\u0930\u092f\u094b\u0917",
  "\u0939\u094b\u092e \u0921\u093f\u0932\u0940\u0935\u0930\u0940 \u0915\u0947\u0935\u0932 5 \u0915\u093f\u092e\u0940 \u0926\u093e\u092f\u0930\u0947 \u092e\u0947\u0902 (\u0928\u094d\u092f\u0942\u0928\u0924\u092e \u0911\u0930\u094d\u0921\u0930 \u20b950)",
];

const TESTIMONIALS = [
  {
    text: "\u0938\u092e\u094b\u0938\u093e \u092c\u093f\u0932\u094d\u0915\u0941\u0932 \u0935\u0948\u0938\u093e \u0939\u0940 \u0915\u0941\u0930\u0915\u0941\u0930\u093e \u091c\u0948\u0938\u093e \u092c\u091a\u092a\u0928 \u092e\u0947\u0902 \u0916\u093e\u092f\u093e \u0925\u093e\u0964 \u091c\u0932\u0947\u092c\u0940 \u0917\u0930\u092e\u093e\u0917\u0930\u092e \u0914\u0930 \u0930\u0938\u092d\u0930\u0940\u0964 \u092c\u0939\u0941\u0924 \u092c\u0922\u093c\u093f\u092f\u093e!",
    author:
      "\u0930\u093e\u0939\u0941\u0932 \u092e\u093f\u0936\u094d\u0930\u093e, \u0928\u0948\u0928\u0940",
  },
  {
    text: "\u0925\u093e\u0932\u0940 \u092e\u0947\u0902 \u0926\u093e\u0932 \u092e\u0916\u0928\u0940 \u0915\u093e \u0938\u094d\u0935\u093e\u0926 \u0932\u093e\u091c\u0935\u093e\u092c\u0964 \u0918\u0930 \u0915\u093e \u0916\u093e\u0928\u093e \u092f\u093e\u0926 \u0906 \u0917\u092f\u093e\u0964 \u0938\u093e\u092b\u093c-\u0938\u092b\u093c\u093e\u0908 \u092d\u0940 \u0936\u093e\u0928\u0926\u093e\u0930\u0964",
    author:
      "\u092a\u094d\u0930\u0940\u0924\u093f \u0938\u093f\u0902\u0939, \u0905\u0921\u093e \u092e\u094b\u0921\u093c",
  },
];

const CART_KEY = "bhojnalaya_cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartCount(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// ── Menu Card ────────────────────────────────────────────────────
function MenuCard({
  item,
  index,
  cartQty,
  onAdd,
}: {
  item: MenuItem;
  index: number;
  cartQty: number;
  onAdd: (item: MenuItem) => void;
}) {
  const [added, setAdded] = useState(false);
  const available = item.stock - cartQty;
  const inStock = available > 0;

  function handleAdd() {
    if (!inStock) return;
    onAdd(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  const btnClass = `w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 hindi-text ${inStock ? (added ? "bg-emerald-500 text-white" : "bg-secondary text-white hover:bg-secondary/90 hover:scale-[1.02]") : "bg-muted text-muted-foreground cursor-not-allowed"}`;

  return (
    <motion.div
      data-ocid={`menu.item.${index + 1}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="bg-card rounded-2xl overflow-hidden shadow-card flex flex-col hover:-translate-y-1 transition-transform duration-300"
      style={{ border: "1px solid oklch(0.88 0.04 72)" }}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {inStock ? (
          <span className="absolute top-2 right-2 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
            📦 \u0938\u094d\u091f\u0949\u0915: {available} \u092c\u091a\u0947
          </span>
        ) : (
          <span className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-red-200">
            \u0906\u0909\u091f \u0911\u092b \u0938\u094d\u091f\u0949\u0915
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-xl font-bold text-foreground hindi-text mb-1">
          {item.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed hindi-text flex-1 mb-3">
          {item.desc}
        </p>
        <p className="text-primary font-bold text-2xl mb-3 font-display">
          \u20b9{item.price}{" "}
          <span className="text-sm font-normal text-muted-foreground hindi-text">
            \u092a\u094d\u0930\u0924\u093f \u092a\u094d\u0932\u0947\u091f
          </span>
        </p>
        <button
          type="button"
          data-ocid={`menu.add_button.${index + 1}`}
          onClick={handleAdd}
          disabled={!inStock}
          className={btnClass}
        >
          {added ? (
            <>
              <CheckCircle className="w-4 h-4" />
              \u091c\u0941\u0921\u093c \u0917\u092f\u093e
            </>
          ) : inStock ? (
            <>
              <ShoppingCart className="w-4 h-4" />
              \u0915\u093e\u0930\u094d\u091f \u092e\u0947\u0902
              \u091c\u094b\u0921\u093c\u0947\u0902
            </>
          ) : (
            <>
              \u274c \u0906\u0909\u091f \u0911\u092b
              \u0938\u094d\u091f\u0949\u0915
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ── Main App ────────────────────────────────────────────────────
export default function App() {
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const nameId = useId();
  const addressId = useId();
  const phoneId = useId();

  // Persist cart
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      const menuItem = MENU_ITEMS.find((m) => m.id === item.id)!;
      const currentQty = existing ? existing.quantity : 0;
      if (currentQty + 1 > menuItem.stock) {
        alert(
          `\u26a0\ufe0f \u0915\u0947\u0935\u0932 ${menuItem.stock} ${menuItem.name} \u0909\u092a\u0932\u092c\u094d\u0927 \u0939\u0948\u0902\u0964`,
        );
        return prev;
      }
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [
        ...prev,
        { id: item.id, name: item.name, price: item.price, quantity: 1 },
      ];
    });
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart((prev) => {
      const item = prev.find((c) => c.id === id);
      if (!item) return prev;
      const menuItem = MENU_ITEMS.find((m) => m.id === id)!;
      const newQty = item.quantity + delta;
      if (newQty > menuItem.stock) {
        alert(
          `\u26a0\ufe0f \u0915\u0947\u0935\u0932 ${menuItem.stock} ${menuItem.name} \u0909\u092a\u0932\u092c\u094d\u0927 \u0939\u0948\u0902\u0964`,
        );
        return prev;
      }
      if (newQty <= 0) {
        return prev.filter((c) => c.id !== id);
      }
      return prev.map((c) => (c.id === id ? { ...c, quantity: newQty } : c));
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    if (
      confirm(
        "\u0915\u094d\u092f\u093e \u0906\u092a \u0907\u0938 \u0906\u0907\u091f\u092e \u0915\u094b \u0915\u093e\u0930\u094d\u091f \u0938\u0947 \u0939\u091f\u093e\u0928\u093e \u091a\u093e\u0939\u0924\u0947 \u0939\u0948\u0902?",
      )
    ) {
      setCart((prev) => prev.filter((c) => c.id !== id));
    }
  }, []);

  const clearCart = useCallback(() => {
    if (cart.length === 0) return;
    if (
      confirm(
        "\u0915\u094d\u092f\u093e \u0906\u092a \u0905\u092a\u0928\u093e \u0915\u093e\u0930\u094d\u091f \u0916\u093e\u0932\u0940 \u0915\u0930\u0928\u093e \u091a\u093e\u0939\u0924\u0947 \u0939\u0948\u0902?",
      )
    ) {
      setCart([]);
    }
  }, [cart.length]);

  function orderOnWhatsApp() {
    if (cart.length === 0) {
      alert(
        "\u0915\u0943\u092a\u092f\u093e \u092a\u0939\u0932\u0947 \u0915\u093e\u0930\u094d\u091f \u092e\u0947\u0902 \u0915\u0941\u091b \u0906\u0907\u091f\u092e \u0910\u0921 \u0915\u0930\u0947\u0902\u0964",
      );
      return;
    }
    const name = customerName.trim() || "\u0917\u094d\u0930\u093e\u0939\u0915";
    const address =
      customerAddress.trim() ||
      "\u092a\u0924\u093e \u0928\u0939\u0940\u0902 \u0926\u093f\u092f\u093e";
    const phone =
      customerPhone.trim() ||
      "\u0928\u0939\u0940\u0902 \u0926\u093f\u092f\u093e";

    let msg =
      "\u0928\u092e\u0938\u094d\u0924\u0947 \u0935\u093f\u092a\u093f\u0928 \u0936\u0941\u0915\u094d\u0932 \u092d\u094b\u091c\u0928\u093e\u0932\u092f (\u0905\u0921\u093e \u092e\u094b\u0921\u093c, \u0928\u0948\u0928\u0940),%0A%0A";
    msg += `\u092e\u0948\u0902 *${name}* \u0939\u0942\u0901\u0964%0A`;
    msg += `\u092a\u0924\u093e: ${address}%0A`;
    msg += `\u092b\u093c\u094b\u0928: ${phone}%0A%0A`;
    msg +=
      "\u092e\u0941\u091d\u0947 \u092f\u0947 \u0906\u0907\u091f\u092e \u0911\u0930\u094d\u0921\u0930 \u0915\u0930\u0928\u0947 \u0939\u0948\u0902:%0A%0A";
    for (const item of cart) {
      msg += `🍽️ ${item.name} - ${item.quantity} \u092a\u094d\u0932\u0947\u091f (\u20b9${item.price * item.quantity})%0A`;
    }
    msg += `%0A\ud83d\udccb *\u0915\u0941\u0932 \u092c\u093f\u0932: \u20b9${getCartTotal(cart)}*%0A`;
    msg +=
      "\ud83d\udccd \u0921\u093f\u0932\u0940\u0935\u0930\u0940 \u0915\u094d\u0937\u0947\u0924\u094d\u0930: \u0905\u0921\u093e \u092e\u094b\u0921\u093c, \u0928\u0948\u0928\u0940 (5 \u0915\u093f\u092e\u0940 \u0926\u093e\u092f\u0930\u093e)%0A";
    msg +=
      "\u23f0 \u0921\u093f\u0932\u0940\u0935\u0930\u0940 \u0938\u092e\u092f: \u0915\u0949\u0932 \u092a\u0930 \u0924\u092f \u0915\u0930\u0947\u0902\u0917\u0947%0A%0A";
    msg +=
      "\u0915\u0943\u092a\u092f\u093e \u092e\u0947\u0930\u093e \u0911\u0930\u094d\u0921\u0930 \u0915\u0902\u092b\u0930\u094d\u092e \u0915\u0930\u0947\u0902\u0964 \u0927\u0928\u094d\u092f\u0935\u093e\u0926! \ud83d\ude4f";

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  }

  const cartCount = getCartCount(cart);
  const cartTotal = getCartTotal(cart);

  const navLinks = [
    { href: "#menu", label: "\u092e\u0947\u0928\u0942" },
    {
      href: "#about",
      label: "\u0939\u092e\u093e\u0930\u093e \u092a\u0930\u093f\u091a\u092f",
    },
    { href: "#order", label: "\u0911\u0930\u094d\u0921\u0930" },
    { href: "#contact", label: "\u0938\u0902\u092a\u0930\u094d\u0915" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* \u2500\u2500\u2500 STICKY HEADER \u2500\u2500\u2500 */}
      <header
        className="sticky top-0 z-50 shadow-header"
        style={{ background: "oklch(0.42 0.22 28)" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-6 h-6 text-secondary" />
            <span className="font-display text-white text-lg md:text-xl font-bold hindi-text leading-tight">
              \u0935\u093f\u092a\u093f\u0928 \u0936\u0941\u0915\u094d\u0932
              \u092d\u094b\u091c\u0928\u093e\u0932\u092f
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-ocid="header.link"
                className="text-white/90 hover:text-secondary font-semibold text-sm hindi-text transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#order"
              className="relative flex items-center gap-1.5 bg-secondary text-white px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-secondary/90 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline hindi-text">
                \u0915\u093e\u0930\u094d\u091f
              </span>
              {cartCount > 0 && (
                <span className="bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </a>
            <button
              type="button"
              className="md:hidden text-white p-1"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-0.5 bg-white mb-1" />
              <div className="w-6 h-0.5 bg-white mb-1" />
              <div className="w-6 h-0.5 bg-white" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
              style={{ background: "oklch(0.38 0.22 28)" }}
            >
              <div className="px-4 py-3 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    data-ocid="header.link"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white/90 hindi-text font-semibold text-base py-1"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* \u2500\u2500\u2500 HERO \u2500\u2500\u2500 */}
      <section
        className="relative min-h-[520px] flex items-center justify-center text-center px-4 py-24"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.68), rgba(0,0,0,0.68)), url('https://images.unsplash.com/photo-1517244683847-7456e63c5967?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') center/cover no-repeat`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="max-w-3xl"
        >
          <h1
            className="font-display text-4xl md:text-6xl font-bold text-white mb-4 hindi-text"
            style={{ textShadow: "3px 3px 6px rgba(0,0,0,0.6)" }}
          >
            \u0938\u094d\u0935\u093e\u0926 \u091c\u094b
            \u0926\u0940\u0935\u093e\u0928\u093e \u092c\u0928\u093e
            \u0926\u0947!
          </h1>
          <p className="text-white/90 text-lg md:text-xl hindi-text mb-2">
            \u0917\u0930\u092e\u093e\u0917\u0930\u092e
            \u0938\u092e\u094b\u0938\u093e \u2022 \u0930\u0938\u092d\u0930\u0940
            \u091c\u0932\u0947\u092c\u0940 \u2022
            \u092a\u093e\u0930\u0902\u092a\u0930\u093f\u0915
            \u0925\u093e\u0932\u0940 \u2022 \u091b\u094b\u0932\u0947
            \u092d\u091f\u0942\u0930\u0947
          </p>
          <p className="text-white/80 text-base hindi-text mb-8">
            🥘 \u0924\u093e\u091c\u093c\u093e \u0914\u0930
            \u0936\u0941\u0926\u094d\u0927
            \u0938\u093e\u092e\u0917\u094d\u0930\u0940 \u0938\u0947
            \u0924\u0948\u092f\u093e\u0930
          </p>
          <a
            href="#menu"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-3 rounded-full text-base hover:bg-primary/90 transition-all hover:-translate-y-0.5 hindi-text shadow-lg"
          >
            \u092e\u0947\u0928\u0942 \u0926\u0947\u0916\u0947\u0902
          </a>
        </motion.div>
      </section>

      {/* \u2500\u2500\u2500 MENU \u2500\u2500\u2500 */}
      <section id="menu" data-ocid="menu.section" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary hindi-text mb-3">
              \ud83e\udd57 \u0939\u092e\u093e\u0930\u093e
              \u092e\u0947\u0928\u0942
            </h2>
            <div className="w-24 h-1.5 bg-secondary rounded-full mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {MENU_ITEMS.map((item, i) => (
              <MenuCard
                key={item.id}
                item={item}
                index={i}
                cartQty={cart.find((c) => c.id === item.id)?.quantity ?? 0}
                onAdd={addToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* \u2500\u2500\u2500 ABOUT \u2500\u2500\u2500 */}
      <section
        id="about"
        className="py-16 px-4"
        style={{ background: "oklch(0.97 0.018 80)" }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-4xl font-bold text-primary hindi-text mb-3">
              \u0939\u092e\u093e\u0930\u0940 \u0915\u0939\u093e\u0928\u0940
            </h2>
            <div className="w-24 h-1.5 bg-secondary rounded-full mx-auto" />
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:w-2/5"
            >
              <img
                src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="\u092d\u094b\u091c\u0928\u093e\u0932\u092f"
                className="w-full rounded-3xl object-cover shadow-lg"
                style={{ maxHeight: 320 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:w-3/5 space-y-3"
            >
              <p className="text-foreground text-base leading-relaxed hindi-text">
                <strong>
                  \u0935\u093f\u092a\u093f\u0928 \u0936\u0941\u0915\u094d\u0932
                  \u092d\u094b\u091c\u0928\u093e\u0932\u092f
                </strong>{" "}
                \u0905\u0921\u093e \u092e\u094b\u0921\u093c,
                \u0928\u0948\u0928\u0940,
                \u092a\u094d\u0930\u092f\u093e\u0917\u0930\u093e\u091c
                \u092e\u0947\u0902 20 \u0935\u0930\u094d\u0937\u094b\u0902
                \u0938\u0947 \u0936\u0941\u0926\u094d\u0927
                \u0936\u093e\u0915\u093e\u0939\u093e\u0930\u0940
                \u092d\u094b\u091c\u0928 \u092a\u0930\u094b\u0938
                \u0930\u0939\u093e \u0939\u0948\u0964
                \u0939\u092e\u093e\u0930\u0940
                \u0935\u093f\u0936\u0947\u0937\u0924\u093e \u0939\u0948 \u2013
                \u0924\u093e\u091c\u0917\u0940,
                \u0938\u093e\u092b-\u0938\u092b\u093e\u0908 \u0914\u0930
                \u092a\u093e\u0930\u0902\u092a\u0930\u093f\u0915
                \u0938\u094d\u0935\u093e\u0926\u0964 \u092f\u0939\u093e\u0901
                \u0915\u093e \u0938\u092e\u094b\u0938\u093e \u0914\u0930
                \u091c\u0932\u0947\u092c\u0940 \u0924\u094b
                \u0915\u094d\u0937\u0947\u0924\u094d\u0930 \u092e\u0947\u0902
                \u092e\u0936\u0939\u0942\u0930 \u0939\u0948\u0964
              </p>
              <ul className="space-y-2">
                {FEATURES.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2 hindi-text text-sm"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-start gap-2 text-sm text-foreground hindi-text">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  <strong>\u092a\u0924\u093e:</strong> \u0905\u0921\u093e
                  \u092e\u094b\u0921\u093c, \u0928\u0948\u0928\u0940,
                  \u092a\u094d\u0930\u092f\u093e\u0917\u0930\u093e\u091c -
                  211008
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* \u2500\u2500\u2500 TESTIMONIALS \u2500\u2500\u2500 */}
      <section
        className="py-16 px-4"
        style={{ background: "oklch(0.93 0.025 75)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-4xl font-bold text-primary hindi-text mb-3">
              \u0917\u094d\u0930\u093e\u0939\u0915\u094b\u0902 \u0915\u0940
              \u0930\u093e\u092f
            </h2>
            <div className="w-24 h-1.5 bg-secondary rounded-full mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 shadow-card"
                style={{ borderLeft: "5px solid oklch(0.65 0.18 45)" }}
              >
                <Quote className="w-6 h-6 text-secondary mb-3" />
                <p className="hindi-text text-foreground leading-relaxed mb-4">
                  {t.text}
                </p>
                <p className="font-semibold text-primary hindi-text text-sm">
                  \u2014 {t.author}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* \u2500\u2500\u2500 CART & ORDER \u2500\u2500\u2500 */}
      <section id="order" data-ocid="cart.section" className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl p-6 md:p-10 shadow-card"
            style={{ border: "1px solid oklch(0.88 0.04 72)" }}
          >
            <h2 className="font-display text-3xl font-bold text-primary hindi-text flex items-center gap-3 mb-6">
              <ShoppingCart className="w-7 h-7" />
              \u0906\u092a\u0915\u093e \u0915\u093e\u0930\u094d\u091f
            </h2>

            {cart.length === 0 ? (
              <div
                data-ocid="cart.empty_state"
                className="text-center py-10 text-muted-foreground hindi-text"
              >
                \ud83d\uded2 \u0906\u092a\u0915\u093e
                \u0915\u093e\u0930\u094d\u091f \u0916\u093e\u0932\u0940
                \u0939\u0948\u0964 \u0915\u0943\u092a\u092f\u093e
                \u090a\u092a\u0930 \u092e\u0947\u0928\u0942 \u0938\u0947
                \u0915\u0941\u091b
                \u0938\u094d\u0935\u093e\u0926\u093f\u0937\u094d\u091f
                \u0921\u093f\u0936 \u0910\u0921 \u0915\u0930\u0947\u0902!
              </div>
            ) : (
              <ul className="divide-y divide-border mb-4">
                <AnimatePresence mode="popLayout">
                  {cart.map((item, idx) => (
                    <motion.li
                      key={item.id}
                      data-ocid={`cart.item.${idx + 1}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.25 }}
                      className="py-3 flex flex-wrap items-center gap-3"
                    >
                      <div className="flex-1 min-w-[180px]">
                        <span className="font-semibold text-foreground hindi-text">
                          {item.name}
                        </span>
                        <span className="text-muted-foreground text-sm ml-2 hindi-text">
                          (\u20b9{item.price} \u00d7 {item.quantity})
                        </span>
                        <span className="text-primary font-bold ml-2">
                          = \u20b9{item.price * item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-secondary/80 transition-colors"
                          aria-label="\u0918\u091f\u093e\u090f\u0902"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-secondary/80 transition-colors"
                          aria-label="\u092c\u0922\u093c\u093e\u090f\u0902"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 text-xs bg-muted hover:bg-destructive hover:text-destructive-foreground px-3 py-1.5 rounded-full transition-colors hindi-text"
                          aria-label="\u0939\u091f\u093e\u090f\u0902"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          \u0939\u091f\u093e\u090f\u0902
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {cart.length > 0 && (
              <div className="text-right text-2xl font-bold text-primary font-display border-t border-border pt-3 mb-6">
                \u0915\u0941\u0932: \u20b9{cartTotal}
              </div>
            )}

            {/* Delivery Form */}
            <div
              className="rounded-2xl p-5 mb-6"
              style={{ background: "oklch(0.96 0.03 72)" }}
            >
              <h3 className="font-semibold text-foreground hindi-text flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-primary" />
                \u0921\u093f\u0932\u0940\u0935\u0930\u0940
                \u091c\u093e\u0928\u0915\u093e\u0930\u0940
                (\u0915\u0947\u0935\u0932 5 \u0915\u093f\u092e\u0940
                \u0926\u093e\u092f\u0930\u0947 \u092e\u0947\u0902)
              </h3>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor={nameId}
                    className="block text-sm font-semibold hindi-text mb-1"
                  >
                    \u0906\u092a\u0915\u093e \u0928\u093e\u092e{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id={nameId}
                    data-ocid="order.input"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="\u091c\u0948\u0938\u0947: \u0930\u093e\u0939\u0941\u0932 \u0915\u0941\u092e\u093e\u0930"
                    className="hindi-text"
                  />
                </div>
                <div>
                  <label
                    htmlFor={addressId}
                    className="block text-sm font-semibold hindi-text mb-1"
                  >
                    \u092a\u0942\u0930\u093e \u092a\u0924\u093e
                    (\u0932\u0948\u0902\u0921\u092e\u093e\u0930\u094d\u0915
                    \u0938\u0939\u093f\u0924){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id={addressId}
                    data-ocid="order.textarea"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="\u092e\u0915\u093e\u0928 \u0928\u0902\u092c\u0930, \u0917\u0932\u0940, \u0915\u094d\u0937\u0947\u0924\u094d\u0930, \u0928\u093f\u0915\u091f\u0924\u092e \u0938\u094d\u0925\u0932"
                    rows={2}
                    className="hindi-text"
                  />
                </div>
                <div>
                  <label
                    htmlFor={phoneId}
                    className="block text-sm font-semibold hindi-text mb-1"
                  >
                    \u092b\u093c\u094b\u0928 \u0928\u0902\u092c\u0930
                    (\u0935\u094d\u0939\u093e\u091f\u094d\u0938\u0910\u092a
                    \u092a\u0930 \u092d\u0947\u091c\u093e
                    \u091c\u093e\u090f\u0917\u093e)
                  </label>
                  <Input
                    id={phoneId}
                    data-ocid="order.phone_input"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="\u0909\u0926\u093e. 9876543210"
                  />
                </div>
              </div>

              <div
                className="mt-4 flex items-start gap-2 rounded-xl p-3 text-sm hindi-text"
                style={{
                  background: "oklch(0.94 0.04 240 / 0.4)",
                  borderLeft: "4px solid oklch(0.52 0.16 240)",
                }}
              >
                <span className="text-base">\u2139\ufe0f</span>
                <span>
                  \u0939\u094b\u092e \u0921\u093f\u0932\u0940\u0935\u0930\u0940
                  \u0915\u0947\u0935\u0932 5 \u0915\u093f\u092e\u0940
                  \u0915\u0947 \u0905\u0902\u0926\u0930 (\u0905\u0921\u093e
                  \u092e\u094b\u0921\u093c, \u0928\u0948\u0928\u0940
                  \u0906\u0938\u092a\u093e\u0938)
                  \u0909\u092a\u0932\u092c\u094d\u0927 \u0939\u0948\u0964
                  \u092a\u0941\u0937\u094d\u091f\u093f \u0915\u0947
                  \u0932\u093f\u090f \u0939\u092e \u0906\u092a\u0915\u094b
                  \u0915\u0949\u0932 \u0915\u0930\u0947\u0902\u0917\u0947\u0964
                  \u0928\u094d\u092f\u0942\u0928\u0924\u092e
                  \u0911\u0930\u094d\u0921\u0930 \u20b950\u0964
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div id="contact" className="flex flex-wrap gap-3 justify-center">
              <a
                href={`tel:${PHONE_TEL}`}
                data-ocid="order.secondary_button"
                className="flex items-center gap-2 bg-blue-500 text-white font-semibold px-5 py-3 rounded-full text-sm hover:bg-blue-600 transition-colors hindi-text"
              >
                <Phone className="w-4 h-4" />
                \u0915\u0949\u0932 \u0915\u0930\u0947\u0902: 9695-613-005
              </a>
              <button
                type="button"
                data-ocid="order.primary_button"
                onClick={orderOnWhatsApp}
                className="flex items-center gap-2 text-white font-semibold px-5 py-3 rounded-full text-sm transition-colors hindi-text"
                style={{ background: "#25D366" }}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp \u092a\u0930 \u0911\u0930\u094d\u0921\u0930
                \u092d\u0947\u091c\u0947\u0902
              </button>
              <button
                type="button"
                data-ocid="order.delete_button"
                onClick={clearCart}
                className="flex items-center gap-2 border border-border text-foreground font-semibold px-5 py-3 rounded-full text-sm hover:bg-muted transition-colors hindi-text"
              >
                <Trash2 className="w-4 h-4" />
                \u0915\u093e\u0930\u094d\u091f \u0916\u093e\u0932\u0940
                \u0915\u0930\u0947\u0902
              </button>
            </div>

            <p className="text-center mt-4 text-xs text-muted-foreground hindi-text">
              \u26a0\ufe0f \u0915\u0940\u092e\u0924\u0947\u0902
              \u092c\u093e\u091c\u093e\u0930 \u092d\u093e\u0935 \u0915\u0947
              \u0905\u0928\u0941\u0938\u093e\u0930 \u092c\u0926\u0932
              \u0938\u0915\u0924\u0940 \u0939\u0948\u0902\u0964
              \u0915\u0943\u092a\u092f\u093e \u0911\u0930\u094d\u0921\u0930
              \u0938\u0947 \u092a\u0939\u0932\u0947
              \u0938\u094d\u091f\u0949\u0915 \u0915\u0940
              \u092a\u0941\u0937\u094d\u091f\u093f \u0915\u0947
              \u0932\u093f\u090f \u0915\u0949\u0932
              \u0915\u0930\u0947\u0902\u0964
            </p>
          </motion.div>
        </div>
      </section>

      {/* \u2500\u2500\u2500 LOCATION \u2500\u2500\u2500 */}
      <section
        className="py-12 px-4"
        style={{ background: "oklch(0.97 0.018 80)" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-primary hindi-text text-center mb-3">
            \ud83d\udccd \u0939\u092e\u093e\u0930\u093e
            \u0938\u094d\u0925\u093e\u0928
          </h2>
          <div className="w-20 h-1.5 bg-secondary rounded-full mx-auto mb-6" />
          <div
            className="h-56 rounded-3xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.88 0.06 72), oklch(0.82 0.10 60))",
            }}
          >
            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow font-semibold hindi-text">
              \u0905\u0921\u093e \u092e\u094b\u0921\u093c,
              \u0928\u0948\u0928\u0940,
              \u092a\u094d\u0930\u092f\u093e\u0917\u0930\u093e\u091c
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground hindi-text">
            <MapPin className="w-4 h-4 text-primary" />
            <span>
              \u0905\u0921\u093e \u092e\u094b\u0921\u093c,
              \u0928\u0948\u0928\u0940,
              \u092a\u094d\u0930\u092f\u093e\u0917\u0930\u093e\u091c - 211008 (5
              \u0915\u093f\u092e\u0940 \u0926\u093e\u092f\u0930\u0947
              \u092e\u0947\u0902 \u0921\u093f\u0932\u0940\u0935\u0930\u0940)
            </span>
          </div>
        </div>
      </section>

      {/* \u2500\u2500\u2500 FOOTER \u2500\u2500\u2500 */}
      <footer
        className="text-white text-center py-8 px-4"
        style={{ background: "oklch(0.28 0.06 145)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="font-display text-xl font-bold hindi-text mb-2 flex items-center justify-center gap-2">
            <Utensils className="w-5 h-5 text-secondary" />
            \u0935\u093f\u092a\u093f\u0928 \u0936\u0941\u0915\u094d\u0932
            \u092d\u094b\u091c\u0928\u093e\u0932\u092f
          </div>
          <p className="text-white/80 text-sm hindi-text mb-1">
            \u00a9 {new Date().getFullYear()} \u0935\u093f\u092a\u093f\u0928
            \u0936\u0941\u0915\u094d\u0932
            \u092d\u094b\u091c\u0928\u093e\u0932\u092f\u0964
            \u0938\u0930\u094d\u0935\u093e\u0927\u093f\u0915\u093e\u0930
            \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924\u0964
          </p>
          <p className="text-white/80 text-sm hindi-text mb-1">
            \ud83d\udcde \u0939\u0947\u0932\u094d\u092a\u0932\u093e\u0907\u0928:{" "}
            <a
              href={`tel:${PHONE_TEL}`}
              className="text-secondary hover:underline"
            >
              {PHONE_DISPLAY}
            </a>
            {" | "}\ud83d\udccd \u0905\u0921\u093e \u092e\u094b\u0921\u093c,
            \u0928\u0948\u0928\u0940,
            \u092a\u094d\u0930\u092f\u093e\u0917\u0930\u093e\u091c
          </p>
          <p className="text-white/80 text-sm hindi-text mb-3">
            \ud83d\udcac \u0935\u094d\u0939\u093e\u091f\u094d\u0938\u0910\u092a:
            9695-613-005 | \ud83d\udd52 \u0938\u0941\u092c\u0939 8:00
            \u092c\u091c\u0947 \u0938\u0947 \u0930\u093e\u0924 10:00
            \u092c\u091c\u0947 \u0924\u0915
          </p>
          <p className="text-white/50 text-xs">
            Built with \u2764\ufe0f using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
