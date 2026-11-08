import { sendEmail } from "../services/mailService.js";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

import { isValidPassword } from "../utils/validators.js";

import User from "../models/User.js";

class PasswordController {
  static async lost(req, res) {
    try {
      const { login, url } = req.body;

      if (typeof login !== "string" || !login.trim()) {
        return res.status(400).json({
          message: "Informe seu e-mail ou usuário.",
        });
      }

      const normalizedLogin = login.trim().toLowerCase();

      const user = await User.findOne({
        $or: [{ email: normalizedLogin }, { username: normalizedLogin }],
      });

      const successMessage =
        "Se a conta estiver cadastrada, você receberá um e-mail de recuperação.";

      if (!user) {
        return res.status(200).json(successMessage);
      }

      const token = crypto.randomBytes(32).toString("hex");

      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      user.resetPasswordToken = tokenHash;
      user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);

      await user.save();

      const resetUrl = new URL("/login/resetar/", process.env.FRONTEND_URL);

      resetUrl.searchParams.set("key", token);
      resetUrl.searchParams.set("login", user.username);

      await sendEmail({
        to: user.email,
        subject: "Recuperação de senha - Dogs API",
        text: `Olá!

          Recebemos uma solicitação para redefinir sua senha.

          Acesse o link abaixo:

          ${resetUrl.toString()}

          Este link expira em 30 minutos.

          Se você não solicitou a recuperação, ignore este e-mail.`,
      });

      return res.status(200).json(successMessage);
    } catch (error) {
      console.error("Erro ao solicitar recuperação de senha:", error);

      return res.status(500).json({
        message: "Não foi possível processar a solicitação.",
      });
    }
  }

  static async reset(req, res) {
    try {
      const { login, key, password } = req.body;

      if (
        typeof login !== "string" ||
        typeof key !== "string" ||
        typeof password !== "string" ||
        !login.trim() ||
        !/^[a-f0-9]{64}$/i.test(key) ||
        !isValidPassword(password)
      ) {
        return res.status(400).json({
          message: "Dados de recuperação inválidos.",
        });
      }

      const tokenHash = crypto.createHash("sha256").update(key).digest("hex");

      const user = await User.findOne({
        username: login.trim().toLowerCase(),
        resetPasswordToken: tokenHash,
        resetPasswordExpires: { $gt: new Date() },
      }).select("+resetPasswordToken +resetPasswordExpires");

      if (!user) {
        return res.status(400).json({
          message: "Link de recuperação inválido ou expirado.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await User.updateOne(
        {
          _id: user._id,
          resetPasswordToken: tokenHash,
          resetPasswordExpires: { $gt: new Date() },
        },
        {
          $set: { password: hashedPassword },
          $unset: {
            resetPasswordToken: "",
            resetPasswordExpires: "",
          },
          $inc: {
            tokenVersion: 1,
          },
        },
      );

      if (result.modifiedCount !== 1) {
        return res.status(400).json({
          message: "Link de recuperação inválido ou expirado.",
        });
      }

      return res.status(200).json({
        message: "Senha redefinida com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);

      return res.status(500).json({
        message: "Erro interno ao redefinir senha.",
      });
    }
  }
}

export default PasswordController;
