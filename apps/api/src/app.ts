import environment from "dotenv";
import cors from "cors";
import express from 'express';
import authRouter from '../src/routers/auth.router';
import passport from 'passport';
import '../passport-config'

import superAdminRouter from "./routers/superAdmin.router"



environment.config();

const app = express();
const PORT = parseInt(process.env.SERVER_PORT_DEV as string);

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://event-idham-gilang.vercel.app/", "http://localhost:3000"],
  })
);
app.use(passport.initialize());
app.use('/v1/api/auth', authRouter);


app.use("/api/superadmin", superAdminRouter);


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port : ${PORT}`);
});
