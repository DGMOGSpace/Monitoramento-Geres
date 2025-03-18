// src/server.ts
import fastify from "fastify";
import fastifyJWT from "@fastify/jwt";
import cors from "@fastify/cors";
import authRoutes from "./routes/auth";
import formRoutes from "./routes/form";
import adminRoutes from "./routes/admin";
import { createAdminUser } from "./services/addAdminMaster";

const app = fastify({ logger: true });

app.register(fastifyJWT, {
  secret: process.env.JWT_SECRET || "supersecret",
});

app.register(cors, {
  origin: "*",
});

app.register(authRoutes);
app.register(formRoutes);
app.register(adminRoutes);
createAdminUser();

const start = async () => {
  try {
    await app.listen({ port: 3021, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
