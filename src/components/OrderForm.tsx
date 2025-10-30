import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Product } from "./ProductCard";

interface OrderFormProps {
  cart: { [key: string]: number };
  products: Product[];
  onSubmitOrder: (orderData: OrderData) => void;
}

export interface OrderData {
  name: string;
  email: string;
  phone: string;
  orderType: "delivery" | "pickup";
  address?: string;
  pickupDate?: Date;
  notes: string;
}

export function OrderForm({ cart, products, onSubmitOrder }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderData>({
    name: "",
    email: "",
    phone: "",
    orderType: "pickup",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitOrder(formData);
  };

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

  const formatDate = (date?: Date) => {
    if (!date) return "Sélectionner une date";
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <section id="commander" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Commander ou Réserver</h2>
          <p className="text-xl text-gray-600">
            Remplissez le formulaire ci-dessous pour finaliser votre commande
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations de commande</CardTitle>
                <CardDescription>
                  Veuillez remplir vos coordonnées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type de commande *</Label>
                    <RadioGroup
                      value={formData.orderType}
                      onValueChange={(value: "delivery" | "pickup") =>
                        setFormData({ ...formData, orderType: value })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup" className="cursor-pointer">
                          Retrait en magasin
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="cursor-pointer">
                          Livraison à domicile
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.orderType === "delivery" && (
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse de livraison *</Label>
                      <Textarea
                        id="address"
                        required
                        value={formData.address || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                  )}

                  {formData.orderType === "pickup" && (
                    <div className="space-y-2">
                      <Label>Date de retrait *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formatDate(formData.pickupDate)}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.pickupDate}
                            onSelect={(date) =>
                              setFormData({ ...formData, pickupDate: date })
                            }
                            disabled={(date) =>
                              date < new Date() ||
                              date < new Date(new Date().setDate(new Date().getDate() - 1))
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes / Instructions spéciales</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Allergies, préférences, etc."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={cartItems.length === 0}
                  >
                    Confirmer la commande
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Votre panier est vide
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map(({ product, quantity }) => (
                      <div key={product.id} className="flex justify-between">
                        <div>
                          <p>{product.name}</p>
                          <p className="text-sm text-gray-600">
                            {quantity} × {product.price.toFixed(2)}€
                          </p>
                        </div>
                        <p className="text-amber-700">
                          {(product.price * quantity).toFixed(2)}€
                        </p>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-xl">
                        <span>Total</span>
                        <span className="text-amber-700">{total.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
