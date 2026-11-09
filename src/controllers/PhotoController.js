import { fileTypeFromBuffer } from "file-type";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "node:path";

import Photo from "../models/Photo.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "dogs",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Upload sem resultado."));
        }

        resolve(result);
      },
    );

    stream.end(buffer);
  });
};

const getImageUrl = (image, req) => {
  if (/^https:\/\//i.test(image)) {
    return image;
  }

  return `${req.protocol}://${req.get("host")}${image}`;
};
class PhotoController {
  static async store(req, res) {
    let uploadedPublicId = null;
    let photoCreated = false;

    try {
      const { nome, peso, idade } = req.body;

      if (
        typeof nome !== "string" ||
        !nome.trim() ||
        nome.trim().length > 100 ||
        peso === undefined ||
        idade === undefined ||
        String(peso).trim() === "" ||
        String(idade).trim() === "" ||
        !req.file
      ) {
        return res.status(400).json({
          message:
            "Preencha todos os campos corretamente e selecione uma imagem.",
        });
      }

      const weight = Number(peso);
      const age = Number(idade);

      if (
        !Number.isFinite(weight) ||
        !Number.isFinite(age) ||
        weight < 0 ||
        age < 0
      ) {
        return res.status(400).json({
          message: "Peso e idade devem ser números válidos.",
        });
      }

      const detectedType = await fileTypeFromBuffer(req.file.buffer);

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (
        !detectedType ||
        !allowedTypes.includes(detectedType.mime) ||
        detectedType.mime !== req.file.mimetype
      ) {
        return res.status(400).json({
          message: "O arquivo enviado não é uma imagem válida.",
        });
      }

      // Enviar a imagem ao Cloudinary
      const uploadedImage = await uploadToCloudinary(req.file.buffer);

      uploadedPublicId = uploadedImage.public_id;

      // Salvar os dados no MongoDB
      const photo = await Photo.create({
        name: nome.trim(),
        weight,
        age,
        image: uploadedImage.secure_url,
        imagePublicId: uploadedPublicId,
        author: req.userId,
      });

      photoCreated = true;

      return res.status(201).json({
        id: photo._id.toString(),
        title: photo.name,
        src: photo.image,
        peso: photo.weight,
        idade: photo.age,
        acessos: photo.acessos,
      });
    } catch (error) {
      console.error("Erro ao cadastrar foto:", error);

      return res.status(500).json({
        message: "Erro interno ao cadastrar foto.",
      });
    } finally {
      // Evitar imagens órfãs quando o MongoDB falhar
      if (uploadedPublicId && !photoCreated) {
        try {
          await cloudinary.uploader.destroy(uploadedPublicId, {
            resource_type: "image",
          });
        } catch (error) {
          console.error("Erro ao limpar imagem do Cloudinary:", error);
        }
      }
    }
  }

  static async index(req, res) {
    try {
      const { _page = 1, _total = 6, _user = 0 } = req.query;

      const page = Number(_page);
      const total = Number(_total);

      if (
        !Number.isInteger(page) ||
        !Number.isInteger(total) ||
        page < 1 ||
        total < 1 ||
        total > 30
      ) {
        return res.status(400).json({
          message: "Parâmetros de paginação inválidos.",
        });
      }

      const filter = {
        image: { $exists: true, $type: "string", $ne: "" },
      };

      if (_user !== "0" && _user !== 0) {
        const userValue = String(_user).trim();

        let user;

        if (mongoose.isValidObjectId(userValue)) {
          user = await User.findById(userValue);
        } else {
          user = await User.findOne({
            username: userValue.toLowerCase(),
          });
        }

        if (!user) {
          return res.status(200).json([]);
        }

        filter.author = user._id;
      }

      const photos = await Photo.find(filter)
        .populate("author", "username")
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * total)
        .limit(total);

      const result = photos.map((photo) => ({
        id: photo._id.toString(),
        author: photo.author?.username ?? "",
        title: photo.name,
        date: String(photo.createdAt.getTime()),
        src: getImageUrl(photo.image, req),
        peso: String(photo.weight),
        idade: String(photo.age),
        acessos: photo.acessos,
      }));

      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro ao listar fotos:", error);

      return res.status(500).json({
        message: "Erro interno ao listar fotos.",
      });
    }
  }

  static async show(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          message: "ID da foto inválido.",
        });
      }

      const photo = await Photo.findById(id).populate("author", "username");

      if (!photo) {
        return res.status(404).json({
          message: "Foto não encontrada.",
        });
      }

      photo.acessos += 1;
      await photo.save();

      const comments = await Comment.find({
        photo: photo._id,
      })
        .populate("author", "username")
        .sort({ createdAt: 1 });

      const formattedComments = comments.map((item) => ({
        comment_ID: item._id.toString(),
        comment_author: item.author?.username ?? "",
        comment_content: item.comment,
      }));

      return res.status(200).json({
        photo: {
          id: photo._id.toString(),
          author: photo.author?.username ?? "",
          title: photo.name,
          date: String(photo.createdAt.getTime()),
          src: getImageUrl(photo.image, req),
          peso: String(photo.weight),
          idade: String(photo.age),
          acessos: photo.acessos,
        },
        comments: formattedComments,
      });
    } catch (error) {
      console.error("Erro ao buscar foto:", error);

      return res.status(500).json({
        message: "Erro interno ao buscar foto.",
      });
    }
  }

  static async destroy(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          message: "ID da foto inválido.",
        });
      }

      const photo = await Photo.findById(id);

      if (!photo) {
        return res.status(404).json({
          message: "Foto não encontrada.",
        });
      }

      if (photo.author.toString() !== req.userId) {
        return res.status(403).json({
          message: "Você não tem permissão para excluir esta foto.",
        });
      }

      const deletedPhoto = await Photo.findOneAndDelete({
        _id: id,
        author: req.userId,
      });

      if (!deletedPhoto) {
        return res.status(404).json({
          message: "Foto não encontrada.",
        });
      }

      await Comment.deleteMany({
        photo: deletedPhoto._id,
      });

      if (deletedPhoto.imagePublicId) {
        try {
          const result = await cloudinary.uploader.destroy(
            deletedPhoto.imagePublicId,
            { resource_type: "image" },
          );

          if (result.result !== "ok" && result.result !== "not found") {
            console.error(
              "Não foi possível remover a imagem do Cloudinary:",
              result,
            );
          }
        } catch (error) {
          console.error("Erro ao excluir imagem do Cloudinary:", error);
        }
      } else if (deletedPhoto.image?.startsWith("/uploads/")) {
        const filename = path.basename(deletedPhoto.image);
        const imagePath = path.resolve("src/uploads", filename);

        try {
          await fs.unlink(imagePath);
        } catch (error) {
          if (error.code !== "ENOENT") {
            console.error("Erro ao excluir arquivo local:", error);
          }
        }
      }

      return res.status(200).json({
        message: "Foto excluída com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir foto:", error);

      return res.status(500).json({
        message: "Erro interno ao excluir foto.",
      });
    }
  }
}

export default PhotoController;
