import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Cart from "../components/Cart";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome {user?.name}</p>
          <p>Your role is {user?.role}</p>
          <p>You are on the User page</p>
          
          <div className="mt-6">
            <Link to="/products">
              <Button>View Products</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Cart />
    </div>
  );
};

export default Dashboard;
