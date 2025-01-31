"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const form_1 = __importDefault(require("./routes/form"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, fastify_1.default)({ logger: true });
app.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || "supersecret",
});
app.register(cors_1.default, {
    origin: "*",
});
app.register(auth_1.default);
app.register(form_1.default);
app.register(admin_1.default);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield app.listen({ port: 3000 });
        console.log("Servidor rodando em http://localhost:3000");
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
});
start();
