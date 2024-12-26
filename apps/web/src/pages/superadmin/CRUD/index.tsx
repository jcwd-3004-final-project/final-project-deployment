// pages/admin/index.tsx

import React from "react";
import { Container, Typography } from "@mui/material";
import ProductList from "@/components/productListAdmin";

const AdminDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" style={{ marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Super Admin
      </Typography>
      <ProductList />
    </Container>
  );
};

export default AdminDashboard;
