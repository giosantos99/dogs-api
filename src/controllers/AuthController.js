import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthController {
  static async login(req, res) {
    try {
      const { username, password } = req.body ?? {};

      if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        !username.trim() ||
        !password
      ) {
        return res.status(400).json({
          message: "Informe usuário e senha.",
        });
      }

      const user = await User.findOne({
        username: username.toLowerCase().trim(),
      }).select("+password");

      if (!user) {
        return res.status(401).json({
          message: "Usuário ou senha inválidos.",
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Usuário ou senha inválidos.",
        });
      }

      const token = jwt.sign(
        {
          sub: user._id.toString(),
          tokenVersion: user.tokenVersion ?? 0,
        },
        process.env.JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "7d",
        },
      );

      return res.status(200).json({
        token,
        user_email: user.email,
        user_nicename: user.username,
        user_display_name: user.username,
      });
    } catch (error) {
      console.error("Erro ao realizar login:", error);

      return res.status(500).json({
        message: "Erro interno ao realizar login.",
      });
    }
  }

  static async validateToken(req, res) {
    return res.status(200).json({
      valid: true,
    });
  }
}

export default AuthController;
