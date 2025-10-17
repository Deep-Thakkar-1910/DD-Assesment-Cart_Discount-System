import React, { useState, useEffect } from "react";
import { productService, type Product } from "../services/productService";
import {
  discountService,
  type ActiveDiscount,
} from "../services/discountService";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../components/ui/badge";
import Navbar from "../components/Navbar";
import { Tag } from "lucide-react";

const Dashboard: React.FC = () => {
  const { updateCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<ActiveDiscount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsResponse, discountsResponse] = await Promise.all([
        productService.getProducts(),
        discountService.getActiveDiscounts(),
      ]);

      if (productsResponse.success && productsResponse.data) {
        setProducts(productsResponse.data);
      } else {
        setError(productsResponse.message);
      }

      if (discountsResponse.success && discountsResponse.data) {
        console.log("Active discounts loaded:", discountsResponse.data);
        setDiscounts(discountsResponse.data);
      }
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    await fetchData();
  };

  const handleCheckoutSuccess = () => {
    // Refresh products after successful checkout
    fetchProducts();
  };

  const handleAddToCart = (product: Product) => {
    updateCart(product);
  };

  const getProductDiscount = (product: Product) => {
    // Check for product-specific discount first (higher priority)
    const productDiscount = discounts.find(
      (d) => d.productId && d.productId === product._id,
    );
    if (productDiscount) {
      console.log(
        `Product-specific discount found for ${product.name}:`,
        productDiscount,
      );
      return productDiscount;
    }

    // Check for category-wide discount
    const categoryDiscount = discounts.find(
      (d) => d.category && d.category === product.category && !d.productId,
    );
    if (categoryDiscount) {
      console.log(
        `Category discount found for ${product.name}:`,
        categoryDiscount,
      );
    }
    return categoryDiscount;
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
          {products.map((product) => {
            const discount = getProductDiscount(product);
            return (
              <Card
                key={product._id}
                className="relative transition-shadow hover:shadow-lg"
              >
                {discount && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="destructive">
                      <Tag className="mr-1 h-3 w-3" />
                      {discount.ruleType}
                    </Badge>
                  </div>
                )}
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
            );
          })}
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
