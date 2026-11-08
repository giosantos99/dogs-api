import Photo from "../models/Photo.js";

class StatsController {
  static async index(req, res) {
    try {
      const photos = await Photo.find({
        author: req.userId,
      })
        .select("name acessos")
        .sort({ createdAt: -1 })
        .lean();

      const stats = photos.map((photo) => ({
        title: photo.name,
        acessos: photo.acessos ?? 0,
      }));

      return res.status(200).json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);

      return res.status(500).json({
        message: "Erro interno ao buscar estatísticas.",
      });
    }
  }
}

export default StatsController;
