import React from "react";
import { useAuth } from "../contexts/AuthContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to the dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome {user?.name}</p>
        <p>Your role is {user?.role}</p>
        <p>You are on the Admin page</p>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
