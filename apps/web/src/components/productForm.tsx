import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  stockQuantity: number;
  images: string[];
  category?: Category;
}

interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  stockQuantity: number;
  images: string;
}

interface ProductFormProps {
  initialValues: Partial<Product>;
  onSubmit: (values: Partial<Product>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://d29jci2p0msjlf.cloudfront.net/v1/api/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };
    fetchCategories();
  }, []);

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      name: initialValues.name || "",
      description: initialValues.description || "",
      price: initialValues.price || 0,
      categoryId: initialValues.categoryId || 0,
      stockQuantity: initialValues.stockQuantity || 0,
      images: initialValues.images ? initialValues.images.join(", ") : "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Wajib diisi"),
      description: Yup.string().required("Wajib diisi"),
      price: Yup.number().required("Wajib diisi").positive("Harus positif"),
      categoryId: Yup.number()
        .required("Wajib diisi")
        .positive("Harus positif"),
      stockQuantity: Yup.number()
        .required("Wajib diisi")
        .min(0, "Tidak boleh negatif"),
      images: Yup.string()
        .required("Wajib diisi")
        .test(
          "valid-urls",
          "Harus berupa URL yang valid, dipisahkan dengan koma",
          (value) => {
            if (!value) return false;
            const urls = value.split(",").map((url) => url.trim());
            const urlPattern = new RegExp(

              "^(https?:\\/\\/)" + // protocol
                "((([a-zA-Z0-9\\-\\.]+)\\.([a-zA-Z]{2,}))|" + // domain name
                "pesanaja.link)" + // OR 18.136.205.218
                "(\\:[0-9]{1,5})?" + // port
                "(\\/.*)?$" // path

            );
            return urls.every((url) => urlPattern.test(url));
          }
        ),
    }),
    onSubmit: (values) => {
      const imagesArray: string[] = values.images
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== "");

      onSubmit({ ...initialValues, ...values, images: imagesArray });
    },
  });

  return (
    <Box p={{ xs: 2, sm: 3, md: 4 }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {/* Nama Produk */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Nama Produk"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>

          {/* Deskripsi Produk */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Deskripsi"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>

          {/* Harga Produk */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="price"
              name="price"
              label="Harga"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
          </Grid>

          {/* Kategori */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="categoryId-label">Kategori</InputLabel>
              <Select
                labelId="categoryId-label"
                id="categoryId"
                name="categoryId"
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                error={
                  formik.touched.categoryId && Boolean(formik.errors.categoryId)
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Jumlah Stok */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="stockQuantity"
              name="stockQuantity"
              label="Jumlah Stok"
              type="number"
              value={formik.values.stockQuantity}
              onChange={formik.handleChange}
              error={
                formik.touched.stockQuantity &&
                Boolean(formik.errors.stockQuantity)
              }
              helperText={
                formik.touched.stockQuantity && formik.errors.stockQuantity
              }
            />
          </Grid>

          {/* URL Gambar */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="images"
              name="images"
              label="URL Gambar (pisahkan dengan koma)"
              value={formik.values.images}
              onChange={formik.handleChange}
              error={formik.touched.images && Boolean(formik.errors.images)}
              helperText={formik.touched.images && formik.errors.images}
            />
          </Grid>

          {/* Tombol Simpan dan Batal */}
          <Grid item xs={12}>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              gap={2}
            >
              <Button
                color="primary"
                variant="contained"
                type="submit"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Simpan
              </Button>
              <Button
                color="secondary"
                variant="outlined"
                onClick={onCancel}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Batal
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ProductForm;
