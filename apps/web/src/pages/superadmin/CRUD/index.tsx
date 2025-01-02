// pages/admin/index.tsx

import React from "react";
import { Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import ProductList from "@/components/productListAdmin";

const AdminDashboard: React.FC = () => {
  // Ambil storeId dari query parameter
  const router = useRouter();
  const { storeId } = router.query; // storeId bisa string | string[] | undefined

  return (
    <Container maxWidth="lg" style={{ marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Super Admin
      </Typography>
      {/* Teruskan storeId ke komponen ProductList */}
      <ProductList storeId={storeId} />
    </Container>
  );
};

export default AdminDashboard;
