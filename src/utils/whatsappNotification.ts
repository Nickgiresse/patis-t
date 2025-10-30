import { Product } from "../components/ProductCard";
import { OrderData } from "../components/OrderForm";

interface CartItem {
  product: Product;
  quantity: number;
}

const ADMIN_PHONE = "656966582";

export function sendWhatsAppNotification(
  orderData: OrderData,
  cartItems: CartItem[],
  orderNumber: string
) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Build message
  let message = `🎂 *Nouvelle commande - Patis't Délice*\n\n`;
  message += `📋 *Commande N°:* ${orderNumber}\n`;
  message += `👤 *Client:* ${orderData.name}\n`;
  message += `📧 *Email:* ${orderData.email}\n`;
  message += `📱 *Téléphone:* ${orderData.phone}\n\n`;

  message += `🛵 *Type:* ${
    orderData.orderType === "delivery" ? "Livraison" : "Retrait en magasin"
  }\n`;

  if (orderData.orderType === "delivery" && orderData.address) {
    message += `📍 *Adresse:* ${orderData.address}\n`;
  }

  if (orderData.pickupDate) {
    message += `📅 *Date de retrait:* ${new Date(orderData.pickupDate).toLocaleDateString(
      "fr-FR"
    )}\n`;
  }

  message += `\n🍰 *Articles commandés:*\n`;
  cartItems.forEach((item) => {
    message += `• ${item.product.name} x${item.quantity} - ${(
      item.product.price * item.quantity
    ).toFixed(2)}€\n`;
  });

  message += `\n💰 *Total:* ${total.toFixed(2)}€\n`;

  if (orderData.notes) {
    message += `\n📝 *Notes:* ${orderData.notes}\n`;
  }

  // Encode message for WhatsApp URL
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${ADMIN_PHONE}?text=${encodedMessage}`;

  // Open WhatsApp in new window
  window.open(whatsappUrl, "_blank");
}
