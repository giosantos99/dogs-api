import User from "../models/User.js";
import bcrypt from "bcryptjs";

import { isValidPassword } from "../utils/validators.js";

class UserController {

  static async store(req, res) {
    try {
      const { username, email, password } = req.body;

      if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        !username.trim() ||
        !email.trim() ||
        !password
      ) {
        return res.status(400).json({
          message: "Preencha todos os campos.",
        });
      }

      if (!isValidPassword(password)) {
        return res.status(400).json({
          message:
            "A senha precisa ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.",
        });
      }

      const normalizedUsername = username.trim().toLowerCase();
      const normalizedEmail = email.trim().toLowerCase();

      const userExists = await User.findOne({
        $or: [
          { username: normalizedUsername },
          { email: normalizedEmail },
        ],
      });

      if (userExists) {
        return res.status(409).json({
          message: "Usuário ou e-mail já cadastrado.",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        username: normalizedUsername,
        email: normalizedEmail,
        password: passwordHash,
      });

      return res.status(201).json({
        id: user._id,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      if (error.code === 11000) {
        return res.status(409).json({
          message: "Usuário ou e-mail já cadastrado.",
        });
      }

      return res.status(500).json({
        message: "Erro interno ao cadastrar usuário.",
      });
    }
  }

  static async show(req, res) {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado.",
        });
      }

      return res.status(200).json({
        id: user._id.toString(),
        nome: user.username,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);

      return res.status(500).json({
        message: "Erro interno ao buscar usuário.",
      });
    }
  }
}

export default UserController;
