import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import ProductList from "@/components/productListAdmin";
import SuperAdminSidebar from "@/components/superAdminSidebar";

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { storeId } = router.query; // storeId bisa berupa string | string[] | undefined

  return (
    <div className="flex">
      {/* Sidebar */}
      <SuperAdminSidebar />

      {/* Konten Utama */}
      <Container
        maxWidth="lg"
        className="mt-12 ml-0 md:ml-[300px] px-4" // ml-0 pada mobile, ml-[300px] (sesuai lebar sidebar) pada md ke atas
      >
        <Typography variant="h4" gutterBottom>
          Dashboard Super Admin
        </Typography>

        {/* Teruskan storeId ke komponen ProductList */}
        <ProductList storeId={storeId} />
      </Container>
    </div>
  );
};

export default AdminDashboard;
