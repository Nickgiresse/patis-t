import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProductsSection } from "./components/ProductsSection";
import { CartSheet } from "./components/CartSheet";
import { OrderForm, OrderData } from "./components/OrderForm";
import { Footer } from "./components/Footer";
import { AdminAuth } from "./components/AdminAuth";
import { AdminPanel } from "./components/AdminPanel";
import { Product } from "./components/ProductCard";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { Sheet, SheetContent } from "./components/ui/sheet";
import { projectId, publicAnonKey } from "./utils/supabase/info";
import { generateInvoicePDF } from "./utils/pdfGenerator";
import { sendWhatsAppNotification } from "./utils/whatsappNotification";

type View = "public" | "admin-auth" | "admin-panel";

export default function App() {
  const [view, setView] = useState<View>("public");
  const [adminToken, setAdminToken] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-8a0a902e`;

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(`${baseUrl}/products`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
        // Filter out null or undefined values
        const validProducts = data.products.filter((prod: Product | null) => prod !== null && prod !== undefined);
        setProducts(validProducts);
      } else {
        // Si aucun produit, utiliser des produits par défaut
        setProducts(getDefaultProducts());
      }
    } catch (error) {
      console.error("Error loading products:", error);
      // En cas d'erreur, utiliser des produits par défaut
      setProducts(getDefaultProducts());
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/categories`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      console.debug("/categories response (public)", data);
      const raw = data.categories ?? data ?? [];
      const names = Array.isArray(raw)
        ? raw
            .map((cat: any) => {
              if (!cat) return undefined;
              if (typeof cat === "string") return cat;
              if (typeof cat.name === "string") return cat.name;
              if (typeof cat.label === "string") return cat.label;
              return undefined;
            })
            .filter((v: any): v is string => typeof v === "string")
        : [];
      const uniqueNames = Array.from(new Set(names));
      setCategories(uniqueNames);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const getDefaultProducts = (): Product[] => [
    {
      id: "product:1",
      name: "Éclair au Chocolat",
      description: "Pâte à choux garnie de crème pâtissière au chocolat",
      price: 4.5,
      image: "https://images.unsplash.com/photo-1643733029149-f5b72338c7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY2xhaXIlMjBkZXNzZXJ0fGVufDF8fHx8MTc2MTc2ODQ2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Éclairs",
    },
    {
      id: "product:2",
      name: "Tarte aux Fruits",
      description: "Pâte sablée avec crème pâtissière et fruits de saison",
      price: 28.0,
      image: "https://images.unsplash.com/photo-1682313052653-afda6f9eb5f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnVpdCUyMHRhcnQlMjBiYWtlcnl8ZW58MXx8fHwxNzYxNzgyNzg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Tartes",
    },
    {
      id: "product:3",
      name: "Macarons Assortis",
      description: "Boîte de 12 macarons aux saveurs variées",
      price: 24.0,
      image: "https://images.unsplash.com/photo-1702745573186-abd6f7b6443c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNhcm9ucyUyMGNvbG9yZnVsfGVufDF8fHx8MTc2MTcxNDM3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Macarons",
    },
    {
      id: "product:4",
      name: "Croissant au Beurre",
      description: "Croissant pur beurre feuilleté à la perfection",
      price: 1.8,
      image: "https://images.unsplash.com/photo-1733754348873-feeb45df3bab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnl8ZW58MXx8fHwxNzYxNjg3Njk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Viennoiseries",
    },
    {
      id: "product:5",
      name: "Gâteau au Chocolat",
      description: "Fondant au chocolat noir 70% avec ganache",
      price: 35.0,
      image: "https://images.unsplash.com/photo-1644158776192-2d24ce35da1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBjYWtlJTIwZGVzc2VydHxlbnwxfHx8fDE3NjE3MTI3MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Gâteaux",
    },
    {
      id: "product:6",
      name: "Pain au Chocolat",
      description: "Viennoiserie feuilletée avec deux barres de chocolat",
      price: 2.0,
      image: "https://images.unsplash.com/photo-1733754348873-feeb45df3bab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnl8ZW58MXx8fHwxNzYxNjg3Njk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Viennoiseries",
    },
  ];

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
    toast.success("Produit ajouté au panier");
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const clearItemFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
    toast.success("Produit retiré du panier");
  };

  const cartCount = Object.values(cart as Record<string, number>).reduce(
    (sum: number, qty: number) => sum + qty,
    0
  );

  const handleCheckout = () => {
    setIsCartOpen(false);
    const orderSection = document.getElementById("commander");
    orderSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitOrder = async (orderData: OrderData) => {
    try {
      const cartItems: { product: Product; quantity: number }[] = (
        Object.entries(cart) as [string, number][]
      )
        .filter(([_, quantity]) => quantity > 0)
        .map(([productId, quantity]) => ({
          product: products.find((p) => p.id === productId)!,
          quantity,
        }));

      // Générer un numéro de commande
      const orderNumber = `CMD${Date.now()}`;

      // Sauvegarder la commande dans la base de données
      const orderPayload = {
        orderNumber,
        customer: orderData,
        items: cartItems.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      };

      const response = await fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to save order");
      }

      // Générer la facture PDF
      generateInvoicePDF(orderData, cartItems, orderNumber);

      // Envoyer la notification WhatsApp
      sendWhatsAppNotification(orderData, cartItems, orderNumber);

      toast.success("Commande envoyée avec succès ! Votre facture a été téléchargée.");
      setCart({});
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Erreur lors de l'envoi de la commande");
    }
  };

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    setView("admin-panel");
  };

  const handleAdminLogout = () => {
    setAdminToken("");
    setView("public");
  };

  if (view === "admin-auth") {
    return <AdminAuth onLogin={handleAdminLogin} />;
  }

  if (view === "admin-panel") {
    return (
      <AdminPanel
        onLogout={handleAdminLogout}
        accessToken={adminToken}
        onProductsUpdate={() => {
          loadProducts();
          loadCategories();
        }}
        onCategoryAdded={(name: string) => {
          setCategories((prev) => Array.from(new Set([...(prev || []), name])));
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster />

      <Header
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onMenuClick={() => setIsMobileMenuOpen(true)}
        onAdminClick={() => setView("admin-auth")}
      />

      <Hero />

      <ProductsSection
        products={products}
        categories={categories}
        cart={cart}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
      />

      <OrderForm
        cart={cart}
        products={products}
        onSubmitOrder={handleSubmitOrder}
      />

      <Footer />

      <CartSheet
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        cart={cart}
        products={products}
        onRemoveFromCart={clearItemFromCart}
        onCheckout={handleCheckout}
      />

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left">
          <nav className="flex flex-col gap-6 mt-8">
            <a
              href="#accueil"
              className="text-lg hover:text-amber-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accueil
            </a>
            <a
              href="#produits"
              className="text-lg hover:text-amber-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Nos Produits
            </a>
            <a
              href="#commander"
              className="text-lg hover:text-amber-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Commander
            </a>
            <a
              href="#contact"
              className="text-lg hover:text-amber-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
