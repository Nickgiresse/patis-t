import React from "react";
import { Product, ProductCard } from "./ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ProductsSectionProps {
  products: Product[];
  categories?: string[]; // optional list provided by backend so empty categories still show
  cart: { [key: string]: number };
  onAddToCart: (productId: string) => void;
  onRemoveFromCart: (productId: string) => void;
}

export function ProductsSection({ products, categories: providedCategories, cart, onAddToCart, onRemoveFromCart }: ProductsSectionProps) {
  const computedFromProducts = Array.from(new Set(products.filter(p => p && p.category).map(p => p.category)));
  const categories = [
    "Tous",
    ...Array.from(new Set([...(providedCategories || []), ...computedFromProducts]))
  ];

  return (
    <section id="produits" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Nos Créations</h2>
          <p className="text-xl text-gray-600">
            Découvrez notre sélection de pâtisseries artisanales
          </p>
        </div>

        <Tabs defaultValue="Tous" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto mb-12" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products
                  .filter(p => category === "Tous" || p.category === category)
                  .map((product) => (
                    <div key={product.id}>
                      <ProductCard
                        product={product}
                        quantity={cart[product.id] || 0}
                        onAddToCart={() => onAddToCart(product.id)}
                        onRemoveFromCart={() => onRemoveFromCart(product.id)}
                      />
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
