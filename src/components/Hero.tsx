import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("produits");
    productsSection?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToOrder = () => {
    const orderSection = document.getElementById("commander");
    orderSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="accueil" className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl">
              L'Art de la Pâtisserie A Bafousaam
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez nos créations artisanales préparées avec passion chaque jour. 
              Commandez en ligne et profitez de nos délices chez vous.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-amber-600 hover:bg-amber-700"
                onClick={scrollToProducts}
              >
                Voir nos produits
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={scrollToOrder}
              >
                Commander maintenant
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1562079859-ef41b665a46d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzYxNzgyNzg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Pâtisserie artisanale"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
