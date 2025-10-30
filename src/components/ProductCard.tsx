import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Minus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
}

export function ProductCard({ product, quantity, onAddToCart, onRemoveFromCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <div className="mb-2">
          <span className="text-sm text-amber-600">{product.category}</span>
        </div>
        <h3 className="text-xl mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="text-2xl text-amber-700">{product.price.toFixed(1)}FCFA</div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        {quantity === 0 ? (
          <Button 
            onClick={onAddToCart} 
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter au panier
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={onRemoveFromCart}
              variant="outline"
              size="icon"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg">{quantity}</span>
            <Button
              onClick={onAddToCart}
              variant="outline"
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
