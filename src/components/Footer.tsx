import { Clock, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl mb-4">Patis't Délice</h3>
            <p className="text-gray-400">
              Des créations artisanales préparées avec passion depuis 1995.
            </p>
          </div>

          <div>
            <h4 className="mb-4">Horaires d'ouverture</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Lundi - Vendredi: 7h - 19h</p>
                  <p>Samedi: 8h - 20h</p>
                  <p>Dimanche: 8h - 13h</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4">Contact</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span>123 Rue de la Pâtisserie, 75001 Paris</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>01 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>contact@patisserie.fr</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Patis't Délice. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
