// src/server.ts
import fastify from "fastify";
import fastifyJWT from "@fastify/jwt";
import cors from "@fastify/cors";
import authRoutes from "./routes/auth";

const app = fastify({ logger: true });

app.register(fastifyJWT, {
  secret: process.env.JWT_SECRET || "supersecret",
});

app.register(cors, {
  origin: "*",
});

app.register(authRoutes);

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("Servidor rodando em http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
