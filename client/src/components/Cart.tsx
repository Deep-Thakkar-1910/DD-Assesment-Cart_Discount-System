import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Your cart is empty</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cart ({cartItems.length} items)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-sm text-gray-500">${item.product.price} each</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                >
                  -
                </Button>
                <Badge variant="secondary">{item.quantity}</Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                >
                  +
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cart;
