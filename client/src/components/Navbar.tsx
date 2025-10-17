import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import CartSidebar from "./CartSidebar";

interface NavbarProps {
  onCheckoutSuccess?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCheckoutSuccess }) => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">DD Store</h1>
          </div>

          {/* Right side - User info and Cart */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
              <Badge variant="secondary" className="text-xs">
                {user?.role}
              </Badge>
            </div>

            {/* Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {getTotalItems() > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center text-xs"
                    >
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="flex w-[400px] flex-col sm:w-[540px]">
                <SheetHeader className="flex-shrink-0">
                  <SheetTitle>Shopping Cart</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-hidden">
                  <CartSidebar onCheckoutSuccess={onCheckoutSuccess} />
                </div>
              </SheetContent>
            </Sheet>

            {/* Logout Button */}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
