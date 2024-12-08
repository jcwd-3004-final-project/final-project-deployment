import express from "express";
import environment from "dotenv";
import cors from "cors";

import superAdminRouter from "./routers/superAdmin.router"



environment.config();

const app = express();
const PORT = parseInt(process.env.SERVER_PORT_DEV as string);

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3300", "https://event-idham-gilang.vercel.app/"],
  })
);

app.use("/api/superadmin", superAdminRouter);


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on port : ${PORT}`);
  });