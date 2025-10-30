import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "./ui/sheet";
import { Button } from "./ui/button";
import { Product } from "./ProductCard";
import { Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: { [key: string]: number };
  products: Product[];
  onRemoveFromCart: (productId: string) => void;
  onCheckout: () => void;
}

export function CartSheet({ 
  open, 
  onOpenChange, 
  cart, 
  products, 
  onRemoveFromCart,
  onCheckout 
}: CartSheetProps) {
  const cartItems = Object.entries(cart)
    .filter(([_, quantity]) => quantity > 0)
    .map(([productId, quantity]) => ({
      product: products.find(p => p.id === productId)!,
      quantity
    }));

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Votre Panier</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pt-6">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Votre panier est vide
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto space-y-4">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4>{product.name}</h4>
                      <p className="text-sm text-gray-600">
                        {quantity} × {product.price.toFixed(2)}€
                      </p>
                      <p className="text-amber-700">
                        {(product.price * quantity).toFixed(2)}€
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveFromCart(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-4">
                <Separator />
                <div className="flex justify-between text-xl">
                  <span>Total</span>
                  <span className="text-amber-700">{total.toFixed(2)}€</span>
                </div>
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  onClick={onCheckout}
                >
                  Passer la commande
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
