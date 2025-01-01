import environment from "dotenv";
import cors from "cors";

import express from "express";
import authRouter from "../src/routers/auth.router";
import passport from "passport";
import "../passport-config";
import superAdminRouter from "./routers/superAdmin.router";
import inventoryRouter from "./routers/inventory.router";
import userRouter from "./routers/user.routes";
import productRouter from "./routers/product.router";
import categoryRouter from "./routers/category.router";
import storeRouter from "./routers/store.router";
import orderRouter from "./routers/admin.order.router";


require("dotenv").config();

const app = express();
const PORT = parseInt(process.env.SERVER_PORT_DEV as string);

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://event-idham-gilang.vercel.app/",
      "http://localhost:3000",
    ],
  })
);

app.use(passport.initialize());

// Logging middleware
app.use((req, res, next) => {
  // console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  // console.log('Headers:', req.headers);
  // console.log('Body:', req.body);
  next();
});

// Routes
app.use("/v1/api/auth", authRouter);
app.use("/v1/api/superadmin", superAdminRouter);
app.use("/v1/api/user", userRouter);
app.use("/v1/api/inventory", inventoryRouter);
app.use("/v1/api/products", productRouter);
app.use("/v1/api/categories", categoryRouter);
app.use("/v1/api/stores", storeRouter);
app.use("/v1/api/orders", orderRouter);


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port : ${PORT}`);
});
