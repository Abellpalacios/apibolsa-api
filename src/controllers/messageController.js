import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { empleoId, usuarioId, empresaId, texto, enviadoPor } = req.body;

    if (!texto || !enviadoPor) {
      return res.status(400).json({ message: "Texto y remitente son obligatorios" });
    }

    const message = await Message.create({
      empleo: empleoId,
      usuario: usuarioId,
      empresa: empresaId,
      texto,
      enviadoPor,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Error en sendMessage:", err);
    res.status(500).json({ message: "Error al enviar mensaje", error: err.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { empleoId, usuarioId, empresaId } = req.query;

    const filtro = {};
    if (empleoId) filtro.empleo = empleoId;
    if (usuarioId) filtro.usuario = usuarioId;
    if (empresaId) filtro.empresa = empresaId;

    const messages = await Message.find(filtro).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Error en getConversation:", err);
    res.status(500).json({ message: "Error al obtener mensajes", error: err.message });
  }
};
