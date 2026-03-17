import { Toaster } from "@/components/ui/sonner";
import { MessageCircle, Phone, ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface Product {
  id: number;
  emoji: string;
  name: string;
  price: number;
  unit: string;
}

interface CartItem {
  product: Product;
  qty: number;
}

const PRODUCTS: Product[] = [
  { id: 1, emoji: "🥘", name: "काजू कतली", price: 800, unit: "किलो" },
  { id: 2, emoji: "🧆", name: "देसी घी गुलाब जामुन", price: 250, unit: "किलो" },
  { id: 3, emoji: "🍘", name: "मोतीचूर के लड्डू", price: 300, unit: "किलो" },
  { id: 4, emoji: "🍲", name: "स्पेशल रसमलाई", price: 40, unit: "पीस" },
  { id: 5, emoji: "🥨", name: "बीकानेरी भुजिया", price: 200, unit: "किलो" },
  { id: 6, emoji: "🍿", name: "नवरत्न मिक्सचर", price: 220, unit: "किलो" },
];

const SHOP_WA = "919452492100";
const SHOP_PHONE = "+919452492100";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    toast.success(`${product.name} कार्ट में जुड़ गया!`);
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  }

  function handleBuyNow() {
    if (cart.length === 0) {
      toast.error("आपका कार्ट खाली है! कृपया पहले कुछ मिठाइयाँ जोड़ें।");
      return;
    }
    setCartOpen(false);
    setContactOpen(true);
  }

  function buildWhatsAppLink() {
    let message = "नमस्ते कल्लू स्वीट्स, मैं यह ऑर्डर करना चाहता हूँ:\n\n";
    for (const item of cart) {
      message += `▪️ ${item.product.name} - ${item.qty} x ₹${item.product.price}\n`;
    }
    message += `\n*कुल राशि: ₹${totalPrice}*\n\nकृपया मुझे बताएँ कि मुझे पेमेंट कैसे करना है और डिलीवरी का समय क्या होगा।`;
    return `https://wa.me/${SHOP_WA}?text=${encodeURIComponent(message)}`;
  }

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background font-body pb-16">
      <Toaster richColors position="top-center" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-shop-red text-white px-[5%] py-4 flex justify-between items-center shadow-md">
        <h1 className="font-display text-xl font-bold tracking-tight">
          🍬 कल्लू स्वीट्स
        </h1>
        <button
          type="button"
          data-ocid="cart.open_modal_button"
          onClick={() => setCartOpen(true)}
          className="bg-shop-yellow text-foreground font-bold px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-transform hover:scale-105"
        >
          <ShoppingCart size={16} />
          कार्ट ({totalItems})
        </button>
      </header>

      {/* Delivery Banner */}
      <div className="bg-shop-orange-light text-shop-orange-text text-center py-2 px-4 text-sm font-semibold">
        🚀 ध्यान दें: हमारी होम डिलीवरी सेवा केवल 5 किलोमीटर के दायरे में उपलब्ध है।
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="font-display text-center text-3xl font-bold text-shop-red mb-8">
          हमारी ताज़ा मिठाइयाँ और नमकीन
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {PRODUCTS.map((product, idx) => (
            <motion.div
              key={product.id}
              data-ocid={`product.item.${idx + 1}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-card rounded-xl p-6 text-center shadow-card border border-border hover:shadow-card-hover transition-shadow"
            >
              <div className="text-6xl mb-4">{product.emoji}</div>
              <h3 className="font-display text-lg font-bold mb-1 text-foreground">
                {product.name}
              </h3>
              <p className="text-shop-green font-bold text-base mb-4">
                ₹{product.price} / {product.unit}
              </p>
              <button
                type="button"
                data-ocid={`product.primary_button.${idx + 1}`}
                onClick={() => addToCart(product)}
                className="w-full bg-shop-red hover:bg-shop-red-dark text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                कार्ट में जोड़ें
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Cart Modal */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            data-ocid="cart.modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[1000] flex items-start justify-center pt-[5vh] px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setCartOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative shadow-modal"
            >
              <button
                type="button"
                data-ocid="cart.close_button"
                onClick={() => setCartOpen(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
              <h2 className="font-display text-2xl font-bold mb-4">
                आपका ऑर्डर
              </h2>

              {cart.length === 0 ? (
                <div
                  data-ocid="cart.empty_state"
                  className="py-8 text-center text-muted-foreground"
                >
                  <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
                  <p>कार्ट खाली है</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mt-2">
                    {cart.map((item, idx) => (
                      <div
                        key={item.product.id}
                        data-ocid={`cart.item.${idx + 1}`}
                        className="flex justify-between items-center border-b border-border pb-3"
                      >
                        <div>
                          <p className="font-semibold text-sm">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ₹{item.product.price} × {item.qty}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm">
                            ₹{item.product.price * item.qty}
                          </span>
                          <button
                            type="button"
                            data-ocid={`cart.delete_button.${idx + 1}`}
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t-2 border-foreground text-right">
                    <span className="font-bold text-lg">
                      कुल राशि: ₹{totalPrice}
                    </span>
                  </div>
                </>
              )}

              <button
                type="button"
                data-ocid="cart.confirm_button"
                onClick={handleBuyNow}
                className="mt-4 w-full bg-shop-green text-white font-bold py-3 rounded-lg text-base hover:opacity-90 transition-opacity"
              >
                अभी खरीदें (Buy Now)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {contactOpen && (
          <motion.div
            data-ocid="contact.modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[2000] flex items-center justify-center px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setContactOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-8 w-full max-w-sm text-center shadow-modal"
            >
              <h3 className="font-display text-2xl font-bold text-shop-red mb-2">
                ऑर्डर पूरा करें
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                अपना ऑर्डर कन्फर्म करने के लिए हमें कॉल करें या व्हाट्सएप पर डिटेल्स भेजें।
              </p>

              <a
                data-ocid="contact.primary_button"
                href={`tel:${SHOP_PHONE}`}
                className="flex items-center justify-center gap-2 w-full mb-3 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-colors"
              >
                <Phone size={18} /> कॉल करें (94524 92100)
              </a>

              <a
                data-ocid="contact.secondary_button"
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#25D366] hover:bg-[#1fb859] text-white font-bold text-base transition-colors"
              >
                <MessageCircle size={18} /> व्हाट्सएप पर ऑर्डर भेजें
              </a>

              <button
                type="button"
                data-ocid="contact.cancel_button"
                onClick={() => setContactOpen(false)}
                className="mt-4 text-muted-foreground underline text-sm bg-transparent border-none cursor-pointer"
              >
                रद्द करें
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-muted-foreground">
        © {year}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
