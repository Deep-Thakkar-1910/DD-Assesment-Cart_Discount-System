import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { discountService } from "../services/discountService";
import { productService } from "../services/productService";
import type {
  ActiveDiscount,
  CreateDiscountData,
} from "../services/discountService";
import type { Product } from "../services/productService";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, LogOut, ShoppingBag } from "lucide-react";

interface DiscountFormData {
  type: "BOGO" | "BUY_X_FOR_Y" | "PERCENTAGE_OFF";
  ruleType: string;
  productId?: string;
  category?: string;
  discountValue: number;
  minQuantity?: number;
  payForQuantity?: number;
  isActive: boolean;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState<ActiveDiscount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] =
    useState<ActiveDiscount | null>(null);
  const [formData, setFormData] = useState<DiscountFormData>({
    type: "PERCENTAGE_OFF",
    ruleType: "",
    productId: "",
    category: "",
    discountValue: 10,
    minQuantity: 1,
    payForQuantity: 1,
    isActive: true,
  });

  useEffect(() => {
    fetchDiscounts();
    fetchProducts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await discountService.getAllDiscounts();
      if (response.success && response.data) {
        setDiscounts(response.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch discounts");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleCreateDiscount = async () => {
    try {
      if (!formData.ruleType) {
        toast.error("Rule type is required");
        return;
      }

      const createData: CreateDiscountData = {
        type: formData.type,
        ruleType: formData.ruleType,
        discountValue: formData.discountValue,
        isActive: formData.isActive,
      };

      if (formData.productId && formData.productId !== "") {
        createData.productId = formData.productId;
      }
      if (formData.category && formData.category !== "") {
        createData.category = formData.category;
      }
      if (formData.minQuantity !== undefined) {
        createData.minQuantity = formData.minQuantity;
      }
      if (formData.payForQuantity !== undefined) {
        createData.payForQuantity = formData.payForQuantity;
      }

      const response = await discountService.createDiscount(createData);
      if (response.success) {
        toast.success("Discount created successfully");
        setIsCreateDialogOpen(false);
        resetForm();
        fetchDiscounts();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create discount");
    }
  };

  const handleUpdateDiscount = async () => {
    if (!selectedDiscount) return;

    try {
      const updateData: any = {
        type: formData.type,
        ruleType: formData.ruleType,
        discountValue: formData.discountValue,
        isActive: formData.isActive,
      };

      if (formData.productId && formData.productId !== "") {
        updateData.productId = formData.productId;
      } else {
        updateData.productId = null;
      }

      if (formData.category && formData.category !== "") {
        updateData.category = formData.category;
      } else {
        updateData.category = null;
      }

      if (formData.minQuantity !== undefined) {
        updateData.minQuantity = formData.minQuantity;
      }
      if (formData.payForQuantity !== undefined) {
        updateData.payForQuantity = formData.payForQuantity;
      }

      const response = await discountService.updateDiscount(
        selectedDiscount._id,
        updateData,
      );
      if (response.success) {
        toast.success("Discount updated successfully");
        setIsEditDialogOpen(false);
        setSelectedDiscount(null);
        resetForm();
        fetchDiscounts();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update discount");
    }
  };

  const handleDeleteDiscount = async () => {
    if (!selectedDiscount) return;

    try {
      const response = await discountService.deleteDiscount(
        selectedDiscount._id,
      );
      if (response.success) {
        toast.success("Discount deleted successfully");
        setIsDeleteDialogOpen(false);
        setSelectedDiscount(null);
        fetchDiscounts();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete discount");
    }
  };

  const openEditDialog = (discount: ActiveDiscount) => {
    setSelectedDiscount(discount);
    setFormData({
      type: discount.type as "BOGO" | "BUY_X_FOR_Y" | "PERCENTAGE_OFF",
      ruleType: discount.ruleType,
      productId: discount.productId || "",
      category: discount.category || "",
      discountValue: discount.discountValue,
      minQuantity: discount.minQuantity || 1,
      payForQuantity: discount.payForQuantity || 1,
      isActive: discount.isActive !== undefined ? discount.isActive : true,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (discount: ActiveDiscount) => {
    setSelectedDiscount(discount);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      type: "PERCENTAGE_OFF",
      ruleType: "",
      productId: "",
      category: "",
      discountValue: 0,
      minQuantity: 1,
      payForQuantity: 1,
      isActive: true,
    });
  };

  const getProductName = (productId?: string) => {
    if (!productId) return "N/A";
    const product = products.find((p) => p._id === productId);
    return product ? product.name : "Unknown Product";
  };

  const getDiscountTypeLabel = (type: string) => {
    switch (type) {
      case "BOGO":
        return "Buy One Get One";
      case "BUY_X_FOR_Y":
        return "Buy X for Y";
      case "PERCENTAGE_OFF":
        return "Percentage Off";
      default:
        return type;
    }
  };

  // Get unique categories from products
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-primary h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Discount Management</CardTitle>
                <CardDescription>
                  Create and manage discount rules for your store
                </CardDescription>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Discount
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-gray-500">
                Loading discounts...
              </div>
            ) : discounts.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No discounts found. Create your first discount to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Type</TableHead>
                    <TableHead>Discount Type</TableHead>
                    <TableHead>Product/Category</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Min Qty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discounts.map((discount) => (
                    <TableRow key={discount._id}>
                      <TableCell className="font-medium">
                        {discount.ruleType}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getDiscountTypeLabel(discount.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {discount.productId ? (
                          <span className="text-sm">
                            {getProductName(discount.productId)}
                          </span>
                        ) : discount.category ? (
                          <Badge variant="secondary">{discount.category}</Badge>
                        ) : (
                          <span className="text-gray-400">Global</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {discount.type === "PERCENTAGE_OFF" ? (
                          <span>{discount.discountValue}%</span>
                        ) : discount.type === "BUY_X_FOR_Y" ? (
                          <span>
                            Buy {discount.minQuantity} Pay{" "}
                            {discount.payForQuantity}
                          </span>
                        ) : (
                          <span>BOGO</span>
                        )}
                      </TableCell>
                      <TableCell>{discount.minQuantity || 1}</TableCell>
                      <TableCell>
                        {discount.isActive !== false ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(discount)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(discount)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Create Discount Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Discount</DialogTitle>
            <DialogDescription>
              Add a new discount rule to your store
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Discount Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE_OFF">
                      Percentage Off
                    </SelectItem>
                    <SelectItem value="BOGO">Buy One Get One</SelectItem>
                    <SelectItem value="BUY_X_FOR_Y">Buy X for Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ruleType">Rule Name</Label>
                <Input
                  id="ruleType"
                  placeholder="e.g., Summer Sale"
                  value={formData.ruleType}
                  onChange={(e) =>
                    setFormData({ ...formData, ruleType: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Product (Optional)</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, productId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product._id} value={product._id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type === "PERCENTAGE_OFF" && (
              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Percentage</Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 10"
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountValue: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            )}

            {formData.type === "BUY_X_FOR_Y" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minQuantity">Buy Quantity</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    min="1"
                    value={formData.minQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minQuantity: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payForQuantity">Pay For Quantity</Label>
                  <Input
                    id="payForQuantity"
                    type="number"
                    min="1"
                    value={formData.payForQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payForQuantity: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateDiscount}>Create Discount</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Discount Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Discount</DialogTitle>
            <DialogDescription>
              Update the discount rule details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Discount Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE_OFF">
                      Percentage Off
                    </SelectItem>
                    <SelectItem value="BOGO">Buy One Get One</SelectItem>
                    <SelectItem value="BUY_X_FOR_Y">Buy X for Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ruleType">Rule Name</Label>
                <Input
                  id="edit-ruleType"
                  value={formData.ruleType}
                  onChange={(e) =>
                    setFormData({ ...formData, ruleType: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-productId">Product (Optional)</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, productId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product._id} value={product._id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category (Optional)</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type === "PERCENTAGE_OFF" && (
              <div className="space-y-2">
                <Label htmlFor="edit-discountValue">Discount Percentage</Label>
                <Input
                  id="edit-discountValue"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountValue: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            )}

            {formData.type === "BUY_X_FOR_Y" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-minQuantity">Buy Quantity</Label>
                  <Input
                    id="edit-minQuantity"
                    type="number"
                    min="1"
                    value={formData.minQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minQuantity: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-payForQuantity">Pay For Quantity</Label>
                  <Input
                    id="edit-payForQuantity"
                    type="number"
                    min="1"
                    value={formData.payForQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payForQuantity: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedDiscount(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateDiscount}>Update Discount</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Discount</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this discount rule? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedDiscount && (
            <div className="rounded-md bg-gray-50 p-4">
              <p className="text-sm">
                <strong>Rule:</strong> {selectedDiscount.ruleType}
              </p>
              <p className="text-sm">
                <strong>Type:</strong>{" "}
                {getDiscountTypeLabel(selectedDiscount.type)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedDiscount(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDiscount}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
