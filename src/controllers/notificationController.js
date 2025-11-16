import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const filtro = {};

    if (req.user) filtro.usuario = req.user._id;
    if (req.company) filtro.empresa = req.company._id;

    const notifications = await Notification.find(filtro)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    console.error("Error en getMyNotifications:", err);
    res.status(500).json({ message: "Error al obtener notificaciones", error: err.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    notification.leida = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    console.error("Error en markNotificationRead:", err);
    res.status(500).json({ message: "Error al marcar notificación", error: err.message });
  }
};
