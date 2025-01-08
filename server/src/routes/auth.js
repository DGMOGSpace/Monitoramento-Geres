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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function authRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post("/checkEmail", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { email } = request.body;
            const user = yield prisma.user.findUnique({
                where: { email },
            });
            if (user === null || user === void 0 ? void 0 : user.email) {
                reply
                    .status(200)
                    .send({ email: user.email, modify: user.modifyPassword });
            }
            else {
                reply.status(404).send(false);
            }
        }));
        fastify.put("/modifyPassword", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = request.body;
            try {
                yield prisma.user.update({
                    where: { email },
                    data: {
                        password,
                        active: true,
                    },
                });
                reply
                    .status(200)
                    .send({ success: true, message: "Senha cadastrada com sucesso." });
            }
            catch (error) {
                reply
                    .status(500)
                    .send({ success: false, message: "Erro ao cadastrar a senha." });
            }
        }));
        fastify.post("/login", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = request.body;
            const user = yield prisma.user.findUnique({
                where: { email, password, active: true },
            });
            if (!user) {
                return reply.status(401).send({ message: "Credenciais inválidas" });
            }
            const token = fastify.jwt.sign({ id: user.id, email: user.email }, {
                expiresIn: process.env.JWT_EXPIRATION || "1h",
            });
            const userResponse = {
                id: user.id,
                fullName: user.fullName,
                geres: user.geres,
                admin: user.admin,
                email: user.email,
                modify: user.modifyPassword,
            };
            return {
                user: userResponse,
                token,
            };
        }));
    });
}
