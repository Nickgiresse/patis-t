import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Trash2, LogOut, Package } from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Product } from "./ProductCard";

interface AdminPanelProps {
  onLogout: () => void;
  accessToken: string;
  onProductsUpdate: () => void;
  onCategoryAdded?: (name: string) => void;
}

interface Category {
  id: string;
  name: string;
}

export function AdminPanel({ onLogout, accessToken, onProductsUpdate, onCategoryAdded }: AdminPanelProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
  });

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-8a0a902e`;

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/categories`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      console.debug("/categories response (admin)", data);
      const raw = data.categories ?? data ?? [];
      const normalized: Category[] = Array.isArray(raw)
        ? raw
            .map((cat: any): Category | undefined => {
              if (!cat) return undefined;
              if (typeof cat === "string") return { id: cat, name: cat };
              const name = typeof cat.name === "string" ? cat.name : typeof cat.label === "string" ? cat.label : undefined;
              if (!name) return undefined;
              const id = typeof cat.id === "string" ? cat.id : name;
              return { id, name };
            })
            .filter((v: any): v is Category => !!v)
        : [];
      // dedupe by name
      const uniqueByName = Array.from(new Map(normalized.map(c => [c.name, c])).values());
      setCategories(uniqueByName);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Erreur lors du chargement des catégories");
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(`${baseUrl}/products`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      // Filter out null or undefined values
      const validProducts = (data.products || []).filter((prod: Product | null) => prod !== null && prod !== undefined);
      setProducts(validProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Erreur lors du chargement des produits");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Veuillez entrer un nom de catégorie");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Server error adding category:", data);
        throw new Error(data.error || "Failed to add category");
      }

      console.log("Category added:", data);
      toast.success("Catégorie ajoutée avec succès");
      // Push immediately into public categories list for instant UI feedback
      if (onCategoryAdded) {
        onCategoryAdded(newCategory.trim());
      }
      setNewCategory("");
      setIsAddCategoryOpen(false);
      await loadCategories();
      // Inform the app to refresh public-facing categories/products as well
      onProductsUpdate();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(`Erreur lors de l'ajout de la catégorie: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...newProduct,
          price: typeof newProduct.price === "string" ? parseFloat(newProduct.price) : newProduct.price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Server error adding product:", data);
        throw new Error(data.error || "Failed to add product");
      }

      console.log("Product added:", data);
      toast.success("Produit ajouté avec succès");
      setNewProduct({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
      });
      setIsAddProductOpen(false);
      await loadProducts();
      onProductsUpdate();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(`Erreur lors de l'ajout du produit: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("Produit supprimé avec succès");
      loadProducts();
      onProductsUpdate();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Erreur lors de la suppression du produit");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl">Panneau d'administration</h1>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Catégories</CardTitle>
            <CardDescription>Gérer les catégories de produits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-2 border rounded">
                  {cat.name}
                </div>
              ))}
            </div>
            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une catégorie
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvelle catégorie</DialogTitle>
                  <DialogDescription>Ajouter une nouvelle catégorie de produits</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Nom de la catégorie</Label>
                    <Input
                      id="categoryName"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddCategory} className="w-full">
                    Ajouter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits</CardTitle>
            <CardDescription>{products.length} produit(s) dans la base</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un produit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nouveau produit</DialogTitle>
                  <DialogDescription>Ajouter un nouveau produit à votre catalogue</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Nom du produit *</Label>
                    <Input
                      id="productName"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productPrice">Prix (€) *</Label>
                    <Input
                      id="productPrice"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productImage">URL de l'image</Label>
                    <Input
                      id="productImage"
                      value={newProduct.image}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productCategory">Catégorie *</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) =>
                        setNewProduct({ ...newProduct, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddProduct} className="w-full">
                    Ajouter le produit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des produits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3>{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <div className="flex gap-4 mt-1">
                    <span className="text-amber-700">{product.price.toFixed(2)}€</span>
                    <span className="text-sm text-gray-500">{product.category}</span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
