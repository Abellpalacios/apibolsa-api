import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Notification from "../models/Notification.js";

export const applyToJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { empleoId } = req.body;

    const job = await Job.findById(empleoId).populate("company");
    if (!job || job.estado !== "activo") {
      return res.status(404).json({ message: "Empleo no disponible" });
    }

    const existing = await Application.findOne({
      usuario: userId,
      empleo: empleoId,
    });

    if (existing) {
      return res.status(400).json({ message: "Ya aplicaste a este empleo" });
    }

    const application = await Application.create({
      usuario: userId,
      empleo: empleoId,
      empresa: job.company._id,
    });

    job.candidatosCount += 1;
    await job.save();

    await Notification.create({
      empresa: job.company._id,
      tipo: "nueva_aplicacion",
      titulo: "Nueva aplicación recibida",
      mensaje: `Nuevo candidato para ${job.titulo}`,
      meta: { empleoId: job._id, applicationId: application._id },
    });

    res.status(201).json(application);
  } catch (err) {
    console.error("Error en applyToJob:", err);
    res.status(500).json({ message: "Error al aplicar al empleo", error: err.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({ usuario: userId })
      .populate("empleo", "titulo ubicacion modalidad salarioMin salarioMax company")
      .populate("empresa", "nombre")
      .populate("entrevista");

    const resumen = {
      total: applications.length,
      enProceso: applications.filter(a =>
        ["en_revision", "entrevista_programada", "preseleccionado", "oferta"].includes(a.estado)
      ).length,
      entrevistas: applications.filter(a => a.estado === "entrevista_programada").length,
      pendientes: applications.filter(a => a.estado === "enviada").length,
    };

    res.json({ resumen, applications });
  } catch (err) {
    console.error("Error en getMyApplications:", err);
    res.status(500).json({ message: "Error al obtener aplicaciones", error: err.message });
  }
};

export const getApplicationsForJob = async (req, res) => {
  try {
    const companyId = req.company._id;
    const empleoId = req.params.jobId;

    const applications = await Application.find({
      empleo: empleoId,
      empresa: companyId,
    })
      .populate("usuario", "name email telefono")
      .populate("empleo", "titulo");

    res.json(applications);
  } catch (err) {
    console.error("Error en getApplicationsForJob:", err);
    res.status(500).json({ message: "Error al obtener candidatos", error: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { estado } = req.body;

    const application = await Application.findOne({
      _id: req.params.id,
      empresa: companyId,
    })
      .populate("usuario", "email name")
      .populate("empleo", "titulo");

    if (!application) {
      return res.status(404).json({ message: "Aplicación no encontrada" });
    }

    application.estado = estado;
    await application.save();

    let tipo = "preseleccionado";
    let titulo = "Actualización en tu postulación";
    let mensaje = `Tu postulación para ${application.empleo.titulo} está ahora en estado: ${estado}`;

    if (estado === "entrevista_programada") {
      tipo = "entrevista_confirmada";
      titulo = "Entrevista programada";
    }

    await Notification.create({
      usuario: application.usuario._id,
      tipo,
      titulo,
      mensaje,
      meta: { empleoId: application.empleo._id, applicationId: application._id },
    });

    res.json(application);
  } catch (err) {
    console.error("Error en updateApplicationStatus:", err);
    res.status(500).json({ message: "Error al actualizar aplicación", error: err.message });
  }
};
