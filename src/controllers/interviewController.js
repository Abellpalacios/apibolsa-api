import Interview from "../models/Interview.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

export const scheduleInterview = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { applicationId, fechaHora, modo, enlace, notas } = req.body;

    const application = await Application.findOne({
      _id: applicationId,
      empresa: companyId,
    }).populate("empleo usuario");

    if (!application) {
      return res.status(404).json({ message: "Aplicación no encontrada" });
    }

    const interview = await Interview.create({
      empleo: application.empleo._id,
      usuario: application.usuario._id,
      empresa: companyId,
      fechaHora,
      modo,
      enlace,
      notas,
      estado: "programada",
    });

    application.estado = "entrevista_programada";
    application.entrevista = interview._id;
    await application.save();

    await Notification.create({
      usuario: application.usuario._id,
      tipo: "entrevista_confirmada",
      titulo: "Entrevista programada",
      mensaje: `Tienes una entrevista para ${application.empleo.titulo}`,
      meta: { entrevistaId: interview._id, empleoId: application.empleo._id },
    });

    res.status(201).json(interview);
  } catch (err) {
    console.error("Error en scheduleInterview:", err);
    res.status(500).json({ message: "Error al programar entrevista", error: err.message });
  }
};

export const getCompanyInterviews = async (req, res) => {
  try {
    const companyId = req.company._id;
    const interviews = await Interview.find({ empresa: companyId })
      .populate("empleo", "titulo")
      .populate("usuario", "name email");

    res.json(interviews);
  } catch (err) {
    console.error("Error en getCompanyInterviews:", err);
    res.status(500).json({ message: "Error al obtener entrevistas", error: err.message });
  }
};

export const getUserInterviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const interviews = await Interview.find({ usuario: userId })
      .populate("empleo", "titulo")
      .populate("empresa", "nombre");

    res.json(interviews);
  } catch (err) {
    console.error("Error en getUserInterviews:", err);
    res.status(500).json({ message: "Error al obtener entrevistas", error: err.message });
  }
};
