import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
require("dotenv").config();

const prisma = new PrismaClient();

async function sendEmail(email: string, password: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env["EMAIL_USER"],
      pass: process.env["EMAIL_PASS"],
    },
  });

  if (!user) {
    console.error("Usuário não encontrado.");
    return;
  }

  const mailOptions = {
    from: '"DGMOG - WebApps" <dgmog.ses@gmail.com>',
    to: email,
    subject: `Form - Monitoramento de GERES`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333;">Olá ${user.fullName},</h2>
        <p style="color: #555;">
          Aqui está a sua nova senha para acessar o sistema de monitoramento de GERES:
        </p>
        <h3 style="color: #007bff; padding: 10px; border-radius: 5px; display: inline-block;">
          ${email}
        </h3>
        <h3 style="background-color: #007bff; color: white; padding: 10px; border-radius: 5px; display: inline-block;">
          ${password}
        </h3>
        <p style="color: #555;">
          Você está associado à GERES: <strong>${user.geres}</strong>.
        </p>
        <p style="color: #555;">
          Por favor, mantenha sua senha em um lugar seguro e não a compartilhe com ninguém.
        </p>
        <p style="color: #555;">Se você não solicitou essa alteração, por favor, entre em contato conosco.</p>
        <footer style="margin-block-start: 20px; font-size: 12px; color: #999;">
          <p>Atenciosamente,</p>
          <p>DGMOG - WebApps</p>
        </footer>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail enviado: %s", info.messageId);
  } catch (error) {
    console.error("Erro ao enviar o e-mail: ", error);
  }
}

export { sendEmail };
