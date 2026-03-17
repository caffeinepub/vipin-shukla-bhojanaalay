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
    name: "क्रिस्पी समोसा",
    price: 18,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&h=300&q=80",
    desc: "गरमागरम, कुरकुरा समोसा - हरी चटनी के साथ।",
  },
  {
    id: 2,
    name: "दमदार गरमागरम डोसा",
    price: 80,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&h=300&q=80",
    desc: "क्रिस्पी, गरमागरम डोसा - नारियल चटनी और सांभर के साथ।",
  },
  {
    id: 3,
    name: "विशेष वेज थाली",
    price: 140,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&h=300&q=80",
    desc: "2 रोटी, सब्ज़ी, दाल मखनी, चावल, सलाद, पापड़, अचार।",
  },
  {
    id: 4,
    name: "छोले भटूरे",
    price: 100,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1626132647523-66bc03b5e3a7?auto=format&fit=crop&w=400&h=300&q=80",
    desc: "दो नरम भटूरे, मसालेदार छोले, प्याज-नींबू के साथ।",
  },
  {
    id: 5,
    name: "तंदूरी रोटी",
    price: 12,
    stock: 50,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&h=300&q=80",
    desc: "तंदूर में सेंकी हुई गेहूं की रोटी - मक्खन लगा हुआ।",
  },
];

const FEATURES = [
  "शुद्ध शाकाहारी (कोई अंडा नहीं)",
  "देसी घी का ही प्रयोग",
  "होम डिलीवरी केवल 5 किमी दायरे में (न्यूनतम ऑर्डर ₹50)",
];

const TESTIMONIALS = [
  {
    text: "समोसा बिल्कुल वैसा ही कुरकुरा जैसा बचपन में खाया था। जलेबी गरमागरम और रसभरी। बहुत बढ़िया!",
    author: "राहुल मिश्रा, नैनी",
  },
  {
    text: "थाली में दाल मखनी का स्वाद लाजवाब। घर का खाना याद आ गया। साफ़-सफ़ाई भी शानदार।",
    author: "प्रीति सिंह, अडा मोड़",
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

  const btnClass = `w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
    inStock
      ? added
        ? "bg-emerald-500 text-white"
        : "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02]"
      : "bg-muted text-muted-foreground cursor-not-allowed"
  }`;

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
            📦 Stock: {available} left
          </span>
        ) : (
          <span className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-red-200">
            Out of Stock
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
          ₹{item.price}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            per plate
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
              Added!
            </>
          ) : inStock ? (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          ) : (
            <>❌ Out of Stock</>
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
        alert(`⚠️ Only ${menuItem.stock} ${menuItem.name} available.`);
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
        alert(`⚠️ Only ${menuItem.stock} ${menuItem.name} available.`);
        return prev;
      }
      if (newQty <= 0) {
        return prev.filter((c) => c.id !== id);
      }
      return prev.map((c) => (c.id === id ? { ...c, quantity: newQty } : c));
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    if (confirm("Remove this item from cart?")) {
      setCart((prev) => prev.filter((c) => c.id !== id));
    }
  }, []);

  const clearCart = useCallback(() => {
    if (cart.length === 0) return;
    if (confirm("Clear your cart?")) {
      setCart([]);
    }
  }, [cart.length]);

  function orderOnWhatsApp() {
    if (cart.length === 0) {
      alert("Please add items to cart first.");
      return;
    }
    const name = customerName.trim() || "ग्राहक";
    const address = customerAddress.trim() || "पता नहीं दिया";
    const phone = customerPhone.trim() || "नहीं दिया";

    let msg = "नमस्ते विपिन शुक्ल भोजनालय (अडा मोड़, नैनी),%0A%0A";
    msg += `मैं *${name}* हूँ।%0A`;
    msg += `पता: ${address}%0A`;
    msg += `फ़ोन: ${phone}%0A%0A`;
    msg += "मुझे ये आइटम ऑर्डर करने हैं:%0A%0A";
    for (const item of cart) {
      msg += `🍽️ ${item.name} - ${item.quantity} प्लेट (₹${item.price * item.quantity})%0A`;
    }
    msg += `%0A📋 *कुल बिल: ₹${getCartTotal(cart)}*%0A`;
    msg += "📍 डिलीवरी क्षेत्र: अडा मोड़, नैनी (5 किमी दायरा)%0A";
    msg += "⏰ डिलीवरी समय: कॉल पर तय करेंगे%0A%0A";
    msg += "कृपया मेरा ऑर्डर कंफर्म करें। धन्यवाद! 🙏";

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  }

  const cartCount = getCartCount(cart);
  const cartTotal = getCartTotal(cart);

  const navLinks = [
    { href: "#menu", label: "Menu" },
    { href: "#about", label: "About Us" },
    { href: "#order", label: "Order" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ─── STICKY HEADER ─── */}
      <header
        className="sticky top-0 z-50 shadow-header"
        style={{ background: "oklch(0.42 0.22 28)" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-6 h-6 text-secondary" />
            <span className="font-display text-white text-lg md:text-xl font-bold hindi-text leading-tight">
              विपिन शुक्ल भोजनालय
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-ocid="header.link"
                className="text-white/90 hover:text-secondary font-semibold text-sm transition-colors"
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
              <span className="hidden sm:inline">Cart</span>
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
                    className="text-white/90 font-semibold text-base py-1"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── HERO ─── */}
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
            स्वाद जो दीवाना बना दे!
          </h1>
          <p className="text-white/90 text-lg md:text-xl hindi-text mb-2">
            गरमागरम समोसा • दमदार डोसा • पारंपरिक थाली • छोले भटूरे
          </p>
          <p className="text-white/80 text-base hindi-text mb-8">
            🥘 ताज़ा और शुद्ध सामग्री से तैयार
          </p>
          <a
            href="#menu"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-3 rounded-full text-base hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg"
          >
            View Menu
          </a>
        </motion.div>
      </section>

      {/* ─── MENU ─── */}
      <section id="menu" data-ocid="menu.section" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-3">
              🥗 Our Menu
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

      {/* ─── ABOUT ─── */}
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
            <h2 className="font-display text-4xl font-bold text-primary mb-3">
              Our Story
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
                alt="भोजनालय"
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
                <strong>विपिन शुक्ल भोजनालय</strong> अडा मोड़, नैनी, प्रयागराज में 20
                वर्षों से शुद्ध शाकाहारी भोजन परोस रहा है। हमारी विशेषता है – ताजगी,
                साफ-सफाई और पारंपरिक स्वाद। यहाँ का समोसा और जलेबी तो क्षेत्र में मशहूर है।
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
                  <strong>Address:</strong> अडा मोड़, नैनी, प्रयागराज - 211008
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
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
            <h2 className="font-display text-4xl font-bold text-primary mb-3">
              Customer Reviews
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
                  — {t.author}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CART & ORDER ─── */}
      <section id="order" data-ocid="cart.section" className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl p-6 md:p-10 shadow-card"
            style={{ border: "1px solid oklch(0.88 0.04 72)" }}
          >
            <h2 className="font-display text-3xl font-bold text-primary flex items-center gap-3 mb-6">
              <ShoppingCart className="w-7 h-7" />
              Your Cart
            </h2>

            {cart.length === 0 ? (
              <div
                data-ocid="cart.empty_state"
                className="text-center py-10 text-muted-foreground hindi-text"
              >
                🛒 आपका कार्ट खाली है। कृपया ऊपर मेनू से कुछ स्वादिष्ट डिश ऐड करें!
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
                        <span className="text-muted-foreground text-sm ml-2">
                          (₹{item.price} × {item.quantity})
                        </span>
                        <span className="text-primary font-bold ml-2">
                          = ₹{item.price * item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-secondary/80 transition-colors"
                          aria-label="Decrease"
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
                          aria-label="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          data-ocid={`cart.delete_button.${idx + 1}`}
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 text-xs bg-muted hover:bg-destructive hover:text-destructive-foreground px-3 py-1.5 rounded-full transition-colors"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {cart.length > 0 && (
              <div className="text-right text-2xl font-bold text-primary font-display border-t border-border pt-3 mb-6">
                Total: ₹{cartTotal}
              </div>
            )}

            {/* Delivery Form */}
            <div
              className="rounded-2xl p-5 mb-6"
              style={{ background: "oklch(0.96 0.03 72)" }}
            >
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-primary" />
                Delivery Information{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  (within 5 km only)
                </span>
              </h3>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor={nameId}
                    className="block text-sm font-semibold mb-1"
                  >
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id={nameId}
                    data-ocid="order.input"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="जैसे: राहुल कुमार"
                    className="hindi-text"
                  />
                </div>
                <div>
                  <label
                    htmlFor={addressId}
                    className="block text-sm font-semibold mb-1"
                  >
                    Full Address (with landmark){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id={addressId}
                    data-ocid="order.textarea"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="मकान नंबर, गली, क्षेत्र, निकटतम स्थल"
                    rows={2}
                    className="hindi-text"
                  />
                </div>
                <div>
                  <label
                    htmlFor={phoneId}
                    className="block text-sm font-semibold mb-1"
                  >
                    Phone Number{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      (will be sent on WhatsApp)
                    </span>
                  </label>
                  <Input
                    id={phoneId}
                    data-ocid="order.phone_input"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="उदा. 9876543210"
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
                <span className="text-base">ℹ️</span>
                <span>
                  होम डिलीवरी केवल 5 किमी के अंदर (अडा मोड़, नैनी आसपास) उपलब्ध है।
                  पुष्टि के लिए हम आपको कॉल करेंगे। न्यूनतम ऑर्डर ₹50।
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div id="contact" className="flex flex-wrap gap-3 justify-center">
              <a
                href={`tel:${PHONE_TEL}`}
                data-ocid="order.secondary_button"
                className="flex items-center gap-2 bg-blue-500 text-white font-semibold px-5 py-3 rounded-full text-sm hover:bg-blue-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Us: 9695-613-005
              </a>
              <button
                type="button"
                data-ocid="order.primary_button"
                onClick={orderOnWhatsApp}
                className="flex items-center gap-2 text-white font-semibold px-5 py-3 rounded-full text-sm transition-colors"
                style={{ background: "#25D366" }}
              >
                <MessageCircle className="w-4 h-4" />
                Order on WhatsApp
              </button>
              <button
                type="button"
                data-ocid="order.delete_button"
                onClick={clearCart}
                className="flex items-center gap-2 border border-border text-foreground font-semibold px-5 py-3 rounded-full text-sm hover:bg-muted transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>
            </div>

            <p className="text-center mt-4 text-xs text-muted-foreground hindi-text">
              ⚠️ कीमतें बाजार भाव के अनुसार बदल सकती हैं। कृपया ऑर्डर से पहले स्टॉक की पुष्टि
              के लिए कॉल करें।
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── LOCATION ─── */}
      <section
        className="py-12 px-4"
        style={{ background: "oklch(0.97 0.018 80)" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-primary text-center mb-3">
            📍 Our Location
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
              अडा मोड़, नैनी, प्रयागराज
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground hindi-text">
            <MapPin className="w-4 h-4 text-primary" />
            <span>अडा मोड़, नैनी, प्रयागराज - 211008 (5 किमी दायरे में डिलीवरी)</span>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="text-white text-center py-8 px-4"
        style={{ background: "oklch(0.28 0.06 145)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="font-display text-xl font-bold hindi-text mb-2 flex items-center justify-center gap-2">
            <Utensils className="w-5 h-5 text-secondary" />
            विपिन शुक्ल भोजनालय
          </div>
          <p className="text-white/80 text-sm mb-1">
            © {new Date().getFullYear()} विपिन शुक्ल भोजनालय. All Rights Reserved.
          </p>
          <p className="text-white/80 text-sm mb-1">
            📞 Helpline:{" "}
            <a
              href={`tel:${PHONE_TEL}`}
              className="text-secondary hover:underline"
            >
              {PHONE_DISPLAY}
            </a>
            {" | "}📍 <span className="hindi-text">अडा मोड़, नैनी, प्रयागराज</span>
          </p>
          <p className="text-white/80 text-sm mb-3">
            💬 WhatsApp: 9695-613-005 | 🕒 Open: 8:00 AM – 10:00 PM
          </p>
          <p className="text-white/50 text-xs">
            Built with ❤️ using{" "}
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
