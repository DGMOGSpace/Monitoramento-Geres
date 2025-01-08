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
const client_1 = require("@prisma/client");
require("dotenv").config();
const prisma = new client_1.PrismaClient();
function createAdminUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newUser = yield prisma.user.create({
                data: {
                    fullName: "Admin Master",
                    password: process.env["ADMIN_PASS"] || "dgmopassword",
                    email: "dgmog.ses@gmail.com",
                    modifyPassword: true,
                    geres: 1,
                    cargo: "Admin",
                    setor: "Admin",
                    admin: true,
                },
            });
            console.log("User created:", newUser);
        }
        catch (error) {
            console.error("Error creating user:", error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
createAdminUser();
