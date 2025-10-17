import React, { useState, useEffect } from "react";
import { productService, type Product } from "../services/productService";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../components/ui/badge";
import Navbar from "../components/Navbar";

const Dashboard: React.FC = () => {
  const { updateCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutSuccess = () => {
    // Refresh products after successful checkout
    fetchProducts();
  };

  const handleAddToCart = (product: Product) => {
    updateCart(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold">Welcome to DD Store</h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 h-6 w-1/3 rounded bg-gray-200"></div>
                  <div className="h-8 rounded bg-gray-200"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold">Welcome to DD Store</h1>
          <div className="text-center">
            <p className="mb-4 text-red-500">{error}</p>
            <Button onClick={fetchProducts}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onCheckoutSuccess={handleCheckoutSuccess} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Welcome to DD Store</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product._id}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <Badge variant="secondary">{product.category}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No products available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
