import mongoose from "mongoose";

import Comment from "../models/Comment.js";
import Photo from "../models/Photo.js";
import User from "../models/User.js";

class CommentController {
  static async store(req, res) {
    try {
      const { id } = req.params;
      const { comment } = req.body;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          message: "ID da foto inválido.",
        });
      }

      if (
        typeof comment !== "string" ||
        !comment.trim() ||
        comment.trim().length > 500
      ) {
        return res.status(400).json({
          message: "O comentário deve conter entre 1 e 500 caracteres.",
        });
      }

      const photo = await Photo.findById(id);

      if (!photo) {
        return res.status(404).json({
          message: "Foto não encontrada.",
        });
      }

      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(401).json({
          message: "Usuário não encontrado.",
        });
      }

      const newComment = await Comment.create({
        comment: comment.trim(),
        author: user._id,
        photo: photo._id,
      });

      return res.status(201).json({
        comment_ID: newComment._id.toString(),
        comment_author: user.username,
        comment_content: newComment.comment,
      });
    } catch (error) {
      console.error("Erro ao criar comentário:", error);

      return res.status(500).json({
        message: "Erro interno ao criar comentário.",
      });
    }
  }
}

export default CommentController;
