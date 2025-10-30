import { ShoppingCart, Menu, UserCircle } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  onAdminClick?: () => void;
}

export function Header({ cartCount, onCartClick, onMenuClick, onAdminClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl">Patis't Délice</h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#accueil" className="hover:text-amber-700 transition-colors">
              Accueil
            </a>
            <a href="#produits" className="hover:text-amber-700 transition-colors">
              Nos Produits
            </a>
            <a href="#commander" className="hover:text-amber-700 transition-colors">
              Commander
            </a>
            <a href="#contact" className="hover:text-amber-700 transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {onAdminClick && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onAdminClick}
                title="Administration"
              >
                <UserCircle className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
