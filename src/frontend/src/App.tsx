import { Toaster } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";
import { useReviews } from "./hooks/useQueries";

// ── Types ─────────────────────────────────────────────────────────────────────
interface CartItem {
  id: string;
  name: string;
  nameHi: string;
  nameEn: string;
  price: number;
  unit: string;
  qty: number;
}

type CategoryKey = "breakfast" | "sweets" | "dryfruits" | "thali";

interface MenuItem {
  id: string;
  nameHi: string;
  nameEn: string;
  price: number;
  unit: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const CAROUSEL_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80",
    alt: "Indian sweets",
  },
  {
    url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&q=80",
    alt: "Delicious food",
  },
  {
    url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1200&q=80",
    alt: "Mithai",
  },
  {
    url: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=1200&q=80",
    alt: "Sweets shop",
  },
  {
    url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=80",
    alt: "Samosa",
  },
];

const CATEGORIES: {
  key: CategoryKey;
  labelHi: string;
  labelEn: string;
  emoji: string;
  items: MenuItem[];
}[] = [
  {
    key: "breakfast",
    labelHi: "नाश्ता",
    labelEn: "Breakfast",
    emoji: "🥙",
    items: [
      { id: "b1", nameHi: "समोसा", nameEn: "Samosa", price: 10, unit: "piece" },
      {
        id: "b2",
        nameHi: "जलेबी दही के साथ",
        nameEn: "Jalebi with Curd",
        price: 30,
        unit: "plate",
      },
      {
        id: "b3",
        nameHi: "छोला समोसा आधी प्लेट",
        nameEn: "Chhola Samosa Half Plate",
        price: 25,
        unit: "half plate",
      },
      {
        id: "b4",
        nameHi: "छोला समोसा पूरी प्लेट",
        nameEn: "Chhola Samosa Full Plate",
        price: 45,
        unit: "full plate",
      },
    ],
  },
  {
    key: "sweets",
    labelHi: "मिठाइयाँ",
    labelEn: "Sweets",
    emoji: "🍬",
    items: [
      {
        id: "s1",
        nameHi: "गुलाब जामुन",
        nameEn: "Gulab Jamun",
        price: 250,
        unit: "kg",
      },
      {
        id: "s2",
        nameHi: "काला जामुन",
        nameEn: "Kala Jamun",
        price: 280,
        unit: "kg",
      },
      {
        id: "s3",
        nameHi: "काजू कतली",
        nameEn: "Kaju Katli",
        price: 800,
        unit: "kg",
      },
      {
        id: "s4",
        nameHi: "सोन पापड़ी",
        nameEn: "Soan Papdi",
        price: 300,
        unit: "kg",
      },
      { id: "s5", nameHi: "लड्डू", nameEn: "Laddu", price: 350, unit: "kg" },
      { id: "s6", nameHi: "बर्फी", nameEn: "Barfi", price: 320, unit: "kg" },
      {
        id: "s7",
        nameHi: "ताज़ा छेना",
        nameEn: "Taza Chenna",
        price: 200,
        unit: "kg",
      },
    ],
  },
  {
    key: "dryfruits",
    labelHi: "ड्राई फ्रूट्स",
    labelEn: "Dry Fruits",
    emoji: "🥜",
    items: [
      { id: "d1", nameHi: "काजू", nameEn: "Kaju", price: 900, unit: "kg" },
      { id: "d2", nameHi: "किशमिश", nameEn: "Kismis", price: 200, unit: "kg" },
      { id: "d3", nameHi: "चोहारा", nameEn: "Chohara", price: 350, unit: "kg" },
      { id: "d4", nameHi: "बादाम", nameEn: "Badam", price: 700, unit: "kg" },
      { id: "d5", nameHi: "पिस्ता", nameEn: "Pista", price: 1200, unit: "kg" },
    ],
  },
  {
    key: "thali",
    labelHi: "वेज थाली",
    labelEn: "Veg Thali",
    emoji: "🍽️",
    items: [
      {
        id: "t1",
        nameHi: "रोटी + सब्जी + सलाद + दाल + चावल + पापड़",
        nameEn: "Roti + Sabji + Salad + Dal + Rice + Papad",
        price: 80,
        unit: "thali",
      },
    ],
  },
];

const STATIC_REVIEWS = [
  {
    text: "बहुत ही स्वादिष्ट मिठाइयाँ! गुलाब जामुन सबसे अच्छे लगे।",
    author: "Ramesh Kumar",
    stars: 5,
    product: "गुलाब जामुन",
    time: "1 महीने पहले",
  },
  {
    text: "काजू कतली की क्वालिटी लाजवाब है। हर त्योहार पर यहीं से लेते हैं।",
    author: "Priya Singh",
    stars: 5,
    product: "काजू कतली",
    time: "2 महीने पहले",
  },
  {
    text: "समोसे और जलेबी ताज़े और गर्म मिलते हैं। बढ़िया दुकान!",
    author: "Suresh Yadav",
    stars: 5,
    product: "समोसा",
    time: "3 महीने पहले",
  },
  {
    text: "10 साल से यहाँ की मिठाइयाँ खा रहे हैं, क्वालिटी कभी कम नहीं हुई।",
    author: "Meena Devi",
    stars: 5,
    product: "मिक्स मिठाई",
    time: "6 महीने पहले",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildWhatsAppMessage(cart: CartItem[]): string {
  let msg =
    "नमस्ते Kallu Sweets & Namkeen Shop, मैं यह ऑर्डर करना चाहता/चाहती हूँ:\n\n";
  let total = 0;
  for (const item of cart) {
    const sub = item.price * item.qty;
    total += sub;
    msg += `▪️ ${item.nameHi} (${item.nameEn}) - ${item.qty} × ₹${item.price}/${item.unit} = ₹${sub}\n`;
  }
  msg += `\n*कुल राशि: ₹${total}*\n\nकृपया डिलीवरी की जानकारी दें।`;
  return encodeURIComponent(msg);
}

function timeAgo(timestamp: bigint): string {
  const diffMs = Date.now() - Number(timestamp / 1_000_000n);
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "अभी-अभी";
  if (minutes < 60) return `${minutes} मिनट पहले`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} घंटे पहले`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} दिन पहले`;
  const months = Math.floor(days / 30);
  return `${months} महीने पहले`;
}

function Stars({ count, size = "lg" }: { count: number; size?: "sm" | "lg" }) {
  return (
    <span
      className={
        size === "lg" ? "text-yellow-500 text-lg" : "text-yellow-500 text-sm"
      }
      aria-label={`${count} stars`}
    >
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <fieldset className="flex gap-1 border-none p-0 m-0" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl bg-transparent border-none cursor-pointer p-0 leading-none transition-transform hover:scale-110"
          aria-label={`${star} star`}
        >
          <span
            className={
              star <= (hovered || value) ? "text-yellow-400" : "text-gray-300"
            }
          >
            ★
          </span>
        </button>
      ))}
    </fieldset>
  );
}

// ── Reviews Section ───────────────────────────────────────────────────────────
function ReviewsSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: backendReviews, isLoading } = useReviews();

  const [form, setForm] = useState({
    productName: "",
    customerName: "",
    rating: 5,
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const allReviews = [
    ...(backendReviews ?? []).map((r) => ({
      text: r.message,
      author: r.customerName,
      stars: Number(r.starsCount),
      product: r.productName,
      time: timeAgo(r.timestamp),
      isBackend: true,
    })),
    ...STATIC_REVIEWS.map((r) => ({ ...r, isBackend: false })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("कृपया थोड़ा इंतज़ार करें और दोबारा कोशिश करें।");
      return;
    }
    if (!form.productName || !form.customerName || !form.message) {
      toast.error("कृपया सभी जानकारी भरें।");
      return;
    }
    setSubmitting(true);
    try {
      await actor.addReview(
        form.productName,
        form.customerName,
        BigInt(form.rating),
        form.message,
      );
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setForm({ productName: "", customerName: "", rating: 5, message: "" });
      toast.success("समीक्षा सफलतापूर्वक दर्ज हो गई! धन्यवाद 🙏");
    } catch {
      toast.error("समीक्षा दर्ज करने में समस्या हुई। दोबारा कोशिश करें।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-14 px-4 md:px-10 bg-secondary">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl md:text-4xl text-center text-primary font-bold mb-2">
          ग्राहकों की राय
        </h2>
        <p className="text-center text-muted-foreground mb-8 text-base">
          हमारे ग्राहकों का अनुभव / Customer Reviews
        </p>

        {/* Review Cards */}
        {isLoading ? (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="reviews.loading_state"
          >
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p>समीक्षाएँ लोड हो रही हैं...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto mb-12">
            {allReviews.map((review, i) => (
              <motion.div
                key={`${review.author}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.07, 0.4) }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-card p-5 flex flex-col gap-2 border border-border"
                data-ocid={`reviews.item.${i + 1}`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                    {review.product}
                  </span>
                  {review.isBackend && (
                    <span className="text-xs text-green-600 font-medium">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <Stars count={review.stars} />
                <p className="text-foreground text-base leading-relaxed flex-1">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-muted-foreground text-sm font-semibold">
                    &mdash; {review.author}
                  </p>
                  <p className="text-muted-foreground text-xs">{review.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Write a Review Form */}
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-card border border-border p-6">
            <h3 className="font-display text-xl text-primary font-bold mb-1">
              समीक्षा लिखें / Write a Review
            </h3>
            <p className="text-muted-foreground text-sm mb-5">
              आपने जो खरीदा उसके बारे में दूसरों को बताएं
            </p>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-4"
              data-ocid="reviews.form"
            >
              <div>
                <label
                  htmlFor="review-product"
                  className="block text-sm font-semibold text-foreground mb-1.5"
                >
                  उत्पाद का नाम / Product Name{" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  id="review-product"
                  type="text"
                  required
                  placeholder="जैसे: काजू कतली, समोसा..."
                  value={form.productName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      productName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-base text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  data-ocid="reviews.product.input"
                />
              </div>

              <div>
                <label
                  htmlFor="review-name"
                  className="block text-sm font-semibold text-foreground mb-1.5"
                >
                  आपका नाम / Your Name{" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  id="review-name"
                  type="text"
                  required
                  placeholder="आपका नाम"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      customerName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-base text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  data-ocid="reviews.name.input"
                />
              </div>

              <div>
                <p className="block text-sm font-semibold text-foreground mb-1.5">
                  रेटिंग / Rating <span className="text-destructive">*</span>
                </p>
                <StarSelector
                  value={form.rating}
                  onChange={(v) => setForm((prev) => ({ ...prev, rating: v }))}
                />
              </div>

              <div>
                <label
                  htmlFor="review-message"
                  className="block text-sm font-semibold text-foreground mb-1.5"
                >
                  आपकी समीक्षा / Your Review{" "}
                  <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="review-message"
                  required
                  rows={4}
                  placeholder="अपना अनुभव साझा करें..."
                  value={form.message}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-base text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
                  data-ocid="reviews.message.textarea"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent text-white font-bold py-3 rounded-xl text-base border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                data-ocid="reviews.submit_button"
              >
                {submitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    दर्ज हो रहा है...
                  </>
                ) : (
                  "समीक्षा दें / Submit Review"
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutView, setCheckoutView] = useState(false);
  const [openCategory, setOpenCategory] = useState<CategoryKey | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.nameEn,
          nameHi: item.nameHi,
          nameEn: item.nameEn,
          price: item.price,
          unit: item.unit,
          qty: 1,
        },
      ];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0),
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleCategory = (key: CategoryKey) => {
    setOpenCategory((prev) => (prev === key ? null : key));
  };

  return (
    <div className="min-h-screen">
      <Toaster richColors position="top-center" />

      {/* Skip link */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[9999] focus:bg-accent focus:text-white focus:px-4 focus:py-2"
      >
        मुख्य सामग्री पर जाएँ
      </a>

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-header">
        <div className="flex items-center justify-between px-4 md:px-10 py-3 gap-2">
          <button
            onClick={() => scrollTo("home")}
            className="font-display font-bold text-xl md:text-2xl text-accent bg-transparent border-none cursor-pointer leading-tight"
            type="button"
            data-ocid="nav.link"
          >
            🍬 Kallu Sweets &amp; Namkeen Shop
          </button>

          <div className="flex items-center gap-3">
            {/* Desktop Nav */}
            <nav className="hidden md:block" aria-label="मुख्य नेविगेशन">
              <ul className="flex gap-6 list-none">
                {[
                  { label: "Home", id: "home" },
                  { label: "Menu", id: "menu" },
                  { label: "About", id: "about" },
                  { label: "Reviews", id: "reviews" },
                  { label: "Contact", id: "contact" },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollTo(item.id)}
                      className="text-foreground font-medium hover:text-accent transition-colors bg-transparent border-none cursor-pointer text-base"
                      type="button"
                      data-ocid="nav.link"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Cart button */}
            <button
              onClick={() => {
                setCartOpen(true);
                setCheckoutView(false);
              }}
              className="relative flex items-center gap-1.5 bg-accent text-white font-semibold px-4 py-2 rounded-full text-base border-none cursor-pointer hover:opacity-90 transition-opacity"
              type="button"
              data-ocid="cart.open_modal_button"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-foreground text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav
          className="md:hidden border-t border-border"
          aria-label="मोबाइल नेविगेशन"
        >
          <ul className="flex overflow-x-auto gap-1 px-4 py-2 list-none">
            {[
              { label: "Home", id: "home" },
              { label: "Menu", id: "menu" },
              { label: "About", id: "about" },
              { label: "Reviews", id: "reviews" },
              { label: "Contact", id: "contact" },
            ].map((item) => (
              <li key={item.id} className="shrink-0">
                <button
                  onClick={() => scrollTo(item.id)}
                  className="text-foreground font-medium hover:text-accent transition-colors bg-transparent border-none cursor-pointer text-sm px-3 py-1.5 rounded-full hover:bg-muted"
                  type="button"
                  data-ocid="nav.link"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* ── DELIVERY BANNER ──────────────────────────────────────────────── */}
      <div
        className="fixed top-[88px] md:top-[60px] left-0 w-full z-40 text-center py-2 px-4 text-sm font-semibold"
        style={{
          background: "oklch(0.88 0.12 80)",
          color: "oklch(0.25 0.08 50)",
        }}
        data-ocid="delivery.banner"
      >
        ⚠️ Minimum order for home delivery: ₹100 | Delivery within 5 km radius
        only
      </div>

      <main className="pt-[136px] md:pt-[108px]">
        {/* ── HERO CAROUSEL ────────────────────────────────────────────────── */}
        <section id="home" className="relative">
          <div className="relative w-full h-64 md:h-96 overflow-hidden">
            {CAROUSEL_SLIDES.map((slide, i) => (
              <div
                key={slide.url}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === currentSlide ? 1 : 0 }}
                aria-hidden={i !== currentSlide}
              >
                <img
                  src={slide.url}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
                  <h1 className="font-display text-2xl md:text-4xl text-white font-bold mb-2 drop-shadow-lg">
                    🍬 Kallu Sweets &amp; Namkeen Shop
                  </h1>
                  <p className="text-white/90 text-base md:text-xl font-medium drop-shadow">
                    स्वाद वही, जो दिल को छू जाए।
                  </p>
                </div>
              </div>
            ))}

            {/* Prev/Next arrows */}
            <button
              onClick={() =>
                setCurrentSlide(
                  (p) =>
                    (p - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length,
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl border-none cursor-pointer transition-colors"
              aria-label="Previous slide"
              type="button"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setCurrentSlide((p) => (p + 1) % CAROUSEL_SLIDES.length)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl border-none cursor-pointer transition-colors"
              aria-label="Next slide"
              type="button"
            >
              ›
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {CAROUSEL_SLIDES.map((slide, i) => (
                <button
                  key={slide.url}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-all ${
                    i === currentSlide ? "bg-white scale-125" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                  type="button"
                />
              ))}
            </div>
          </div>

          {/* Welcome card below carousel */}
          <div className="bg-white shadow-card px-6 py-8 text-center">
            <h2 className="font-display text-2xl md:text-3xl text-primary mb-2">
              कल्लू स्वीट्स एंड नमकीन में आपका स्वागत है
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              परंपरिक मिठाइयाँ और कुरकुरे नमकीन का बेहतरीन संगम। शुद्ध देसी घी, ताज़ी
              सामग्री और 10 साल का भरोसा।
            </p>
          </div>
        </section>

        {/* ── IMPORTANT NOTICE BOX ─────────────────────────────────────────── */}
        <div className="px-4 md:px-10 py-6 bg-white" data-ocid="notice.panel">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto rounded-2xl border-2 border-red-500 overflow-hidden shadow-md"
            style={{ background: "oklch(0.97 0.07 80)" }}
          >
            {/* Header bar */}
            <div
              className="flex items-center gap-3 px-5 py-3"
              style={{ background: "oklch(0.40 0.18 25)", color: "white" }}
            >
              <span className="text-2xl">⚠️</span>
              <h3 className="font-display font-bold text-lg md:text-xl">
                ज़रूरी सूचना / Important Notice
              </h3>
            </div>
            {/* Points */}
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">🚚</span>
                <p
                  className="text-base md:text-lg font-semibold"
                  style={{ color: "oklch(0.25 0.08 50)" }}
                >
                  होम डिलीवरी के लिए{" "}
                  <span
                    className="font-extrabold"
                    style={{ color: "oklch(0.40 0.18 25)" }}
                  >
                    न्यूनतम ₹100 का ऑर्डर अनिवार्य है।
                  </span>{" "}
                  <span className="text-muted-foreground font-normal text-sm">
                    (Min. ₹100 order required for home delivery)
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">📍</span>
                <p
                  className="text-base md:text-lg font-semibold"
                  style={{ color: "oklch(0.25 0.08 50)" }}
                >
                  होम डिलीवरी केवल{" "}
                  <span
                    className="font-extrabold"
                    style={{ color: "oklch(0.40 0.18 25)" }}
                  >
                    5 किलोमीटर के दायरे में उपलब्ध है।
                  </span>{" "}
                  <span className="text-muted-foreground font-normal text-sm">
                    (Home delivery available within 5 km radius only)
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── MENU SECTION ─────────────────────────────────────────────────── */}
        <section id="menu" className="py-14 px-4 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl text-center text-primary font-bold mb-8">
              हमारा मेन्यू
            </h2>

            <div className="max-w-3xl mx-auto space-y-3">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.key}
                  className="rounded-xl overflow-hidden border border-border shadow-card"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(cat.key)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-foreground text-white font-bold text-lg cursor-pointer border-none"
                    type="button"
                    aria-expanded={openCategory === cat.key}
                    data-ocid={`menu.${cat.key}.toggle`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">{cat.emoji}</span>
                      <span className="font-display text-xl">
                        {cat.labelHi}
                      </span>
                      <span className="text-white/70 text-base font-normal ml-1">
                        ({cat.labelEn})
                      </span>
                    </span>
                    <span
                      className="text-xl transition-transform duration-300"
                      style={{
                        transform:
                          openCategory === cat.key
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                      }}
                    >
                      ▼
                    </span>
                  </button>

                  {/* Items */}
                  <AnimatePresence initial={false}>
                    {openCategory === cat.key && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-white"
                      >
                        <div className="divide-y divide-border">
                          {cat.items.map((item, idx) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between px-5 py-3 gap-3"
                              data-ocid={`menu.item.${idx + 1}`}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground text-base leading-tight">
                                  {item.nameHi}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  {item.nameEn}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="font-bold text-primary text-base whitespace-nowrap">
                                  ₹{item.price}/{item.unit}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="bg-accent text-white text-sm font-semibold px-3 py-1.5 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap"
                                  type="button"
                                  data-ocid="menu.add_to_cart.button"
                                >
                                  + Add
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── REVIEWS SECTION ──────────────────────────────────────────────── */}
        <ReviewsSection />

        {/* ── ABOUT US ─────────────────────────────────────────────────────── */}
        <section id="about" className="py-14 px-4 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl text-primary font-bold mb-5">
              हमारे बारे में
            </h2>
            <div className="bg-white rounded-2xl shadow-card p-8">
              <p className="text-foreground text-base md:text-lg leading-relaxed">
                Pichle 10 saalon se logon ki pasandida shop jahan shuddh desi
                ghee ki mithaiyan aur anya saaman shuddhata aur safai ke sath
                banaye jaate hain.{" "}
                <span className="text-muted-foreground">
                  (A trusted favorite for 10 years, making pure desi ghee sweets
                  and other items with utmost hygiene and purity.)
                </span>
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── CONTACT SECTION ──────────────────────────────────────────────── */}
        <section id="contact" className="py-14 px-4 md:px-10 bg-secondary">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl text-primary font-bold mb-3">
              संपर्क करें
            </h2>
            <p className="text-muted-foreground mb-2">📍 Naini, Prayagraj</p>
            <p className="text-muted-foreground mb-7">
              ऑर्डर के लिए WhatsApp या Call करें
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/919695613005"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-xl text-base hover:opacity-90 transition-opacity no-underline"
                data-ocid="contact.whatsapp.button"
              >
                💬 WhatsApp Order
              </a>
              <a
                href="tel:+919695613005"
                className="flex items-center justify-center gap-2 bg-accent text-white font-semibold px-6 py-3 rounded-xl text-base hover:opacity-90 transition-opacity no-underline"
                data-ocid="contact.call.button"
              >
                📞 +91 9695613005
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-foreground text-white text-center py-6 px-4">
        <p className="text-base">
          © {new Date().getFullYear()} Kallu Sweets &amp; Namkeen Shop. सभी
          अधिकार सुरक्षित हैं।
        </p>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
          Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-white"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* ── CART SIDEBAR / MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="cart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => {
                setCartOpen(false);
                setCheckoutView(false);
              }}
            />

            {/* Drawer */}
            <motion.div
              key="cart-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
              data-ocid="cart.modal"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-display text-xl text-primary font-bold">
                  {checkoutView ? "अपना ऑर्डर कन्फर्म करें" : "🛒 आपका कार्ट"}
                </h2>
                <button
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutView(false);
                  }}
                  className="text-muted-foreground hover:text-foreground text-2xl bg-transparent border-none cursor-pointer"
                  type="button"
                  aria-label="Close cart"
                  data-ocid="cart.close_button"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {!checkoutView ? (
                  /* Cart view */
                  <>
                    {cart.length === 0 ? (
                      <div
                        className="text-center py-16 text-muted-foreground"
                        data-ocid="cart.empty_state"
                      >
                        <p className="text-4xl mb-3">🛒</p>
                        <p className="text-lg">कार्ट खाली है</p>
                        <p className="text-sm mt-1">मेन्यू से आइटम जोड़ें</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item, idx) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-muted rounded-xl p-3"
                            data-ocid={`cart.item.${idx + 1}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-base leading-tight">
                                {item.nameHi}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                ₹{item.price}/{item.unit}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQty(item.id, -1)}
                                className="w-7 h-7 rounded-full bg-white border border-border text-foreground font-bold cursor-pointer hover:bg-accent hover:text-white hover:border-accent transition-colors"
                                type="button"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="w-6 text-center font-bold text-base">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item.id, 1)}
                                className="w-7 h-7 rounded-full bg-white border border-border text-foreground font-bold cursor-pointer hover:bg-accent hover:text-white hover:border-accent transition-colors"
                                type="button"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-bold text-primary">
                                ₹{item.price * item.qty}
                              </p>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-destructive text-xs hover:underline bg-transparent border-none cursor-pointer"
                                type="button"
                                data-ocid={`cart.delete_button.${idx + 1}`}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* Checkout view */
                  <div className="space-y-4">
                    <div className="bg-muted rounded-xl p-4 space-y-2">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-base"
                        >
                          <span>
                            {item.nameHi} × {item.qty}
                          </span>
                          <span className="font-semibold">
                            ₹{item.price * item.qty}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-border pt-2 flex justify-between font-bold text-lg text-primary">
                        <span>कुल राशि</span>
                        <span>₹{cartTotal}</span>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
                      ⚠️ Minimum ₹100 for home delivery | 5 km radius only
                    </div>

                    <a
                      href={`https://wa.me/919695613005?text=${buildWhatsAppMessage(cart)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-green-600 text-white font-bold py-4 rounded-xl text-lg hover:opacity-90 transition-opacity no-underline"
                      data-ocid="checkout.whatsapp.button"
                    >
                      📱 Order via WhatsApp
                    </a>

                    <a
                      href="tel:+919695613005"
                      className="flex items-center justify-center gap-2 w-full bg-accent text-white font-bold py-4 rounded-xl text-lg hover:opacity-90 transition-opacity no-underline"
                      data-ocid="checkout.call.button"
                    >
                      📞 Call to Order
                    </a>

                    <button
                      onClick={() => setCheckoutView(false)}
                      className="w-full text-muted-foreground hover:text-foreground text-base underline bg-transparent border-none cursor-pointer py-2"
                      type="button"
                      data-ocid="checkout.cancel_button"
                    >
                      ← वापस जाएँ
                    </button>
                  </div>
                )}
              </div>

              {/* Footer actions */}
              {!checkoutView && cart.length > 0 && (
                <div className="border-t border-border px-5 py-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-foreground text-base">
                      कुल राशि:
                    </span>
                    <span className="font-bold text-primary text-xl">
                      ₹{cartTotal}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    ⚠️ Minimum ₹100 for home delivery
                  </p>
                  <button
                    onClick={() => setCheckoutView(true)}
                    className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl text-lg border-none cursor-pointer hover:opacity-90 transition-opacity"
                    type="button"
                    data-ocid="cart.proceed_to_order.button"
                  >
                    Proceed to Order →
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
