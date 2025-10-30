import jsPDF from "jspdf";
import { Product } from "../components/ProductCard";
import { OrderData } from "../components/OrderForm";

interface CartItem {
  product: Product;
  quantity: number;
}

export function generateInvoicePDF(
  orderData: OrderData,
  cartItems: CartItem[],
  orderNumber: string
) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.text("Patis't Délice", 20, 20);
  doc.setFontSize(10);
  doc.text("123 Rue de la Pâtisserie", 20, 27);
  doc.text("75001 Paris", 20, 32);
  doc.text("Tél: 01 23 45 67 89", 20, 37);

  // Invoice title
  doc.setFontSize(18);
  doc.text("FACTURE", 150, 20);
  doc.setFontSize(10);
  doc.text(`N° ${orderNumber}`, 150, 27);
  doc.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, 150, 32);

  // Customer info
  doc.setFontSize(12);
  doc.text("Client:", 20, 50);
  doc.setFontSize(10);
  doc.text(orderData.name, 20, 57);
  doc.text(orderData.email, 20, 62);
  doc.text(orderData.phone, 20, 67);
  if (orderData.address) {
    doc.text(orderData.address, 20, 72);
  }

  // Order type
  doc.setFontSize(10);
  const orderType =
    orderData.orderType === "delivery" ? "Livraison à domicile" : "Retrait en magasin";
  doc.text(`Type: ${orderType}`, 20, 82);
  if (orderData.pickupDate) {
    doc.text(
      `Date de retrait: ${new Date(orderData.pickupDate).toLocaleDateString("fr-FR")}`,
      20,
      87
    );
  }

  // Table header
  let y = 100;
  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.text("Article", 20, y);
  doc.text("Qté", 120, y);
  doc.text("Prix Unit.", 140, y);
  doc.text("Total", 170, y);
  doc.setFont(undefined, "normal");

  // Draw line
  doc.line(20, y + 2, 190, y + 2);

  // Items
  y += 10;
  let total = 0;

  cartItems.forEach((item) => {
    const itemTotal = item.product.price * item.quantity;
    total += itemTotal;

    // Wrap long product names
    const productName = item.product.name;
    if (productName.length > 40) {
      const lines = doc.splitTextToSize(productName, 90);
      doc.text(lines, 20, y);
      y += lines.length * 5;
    } else {
      doc.text(productName, 20, y);
    }

    doc.text(item.quantity.toString(), 120, y);
    doc.text(`${item.product.price.toFixed(2)} €`, 140, y);
    doc.text(`${itemTotal.toFixed(2)} €`, 170, y);
    y += 7;
  });

  // Total line
  y += 5;
  doc.line(20, y, 190, y);
  y += 10;

  doc.setFont(undefined, "bold");
  doc.setFontSize(12);
  doc.text("TOTAL TTC", 120, y);
  doc.text(`${total.toFixed(2)} €`, 170, y);

  // Notes
  if (orderData.notes) {
    y += 15;
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text("Notes:", 20, y);
    const noteLines = doc.splitTextToSize(orderData.notes, 170);
    doc.text(noteLines, 20, y + 5);
  }

  // Footer
  doc.setFontSize(8);
  doc.text(
    "Merci pour votre commande ! À très bientôt chez Patis't Délice",
    105,
    280,
    { align: "center" }
  );

  // Save PDF
  const fileName = `facture_${orderNumber}_${orderData.name.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);

  return fileName;
}
