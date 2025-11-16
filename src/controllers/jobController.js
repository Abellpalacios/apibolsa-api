import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const companyId = req.company._id;
    const {
      titulo,
      departamento,
      tipoContrato,
      modalidad,
      ubicacion,
      salarioMin,
      salarioMax,
      descripcion,
      requisitos,
      etiquetas,
      expiraEn,
    } = req.body;

    if (!titulo || !descripcion) {
      return res.status(400).json({ message: "Título y descripción son obligatorios" });
    }

    const job = await Job.create({
      company: companyId,
      titulo,
      departamento,
      tipoContrato,
      modalidad,
      ubicacion,
      salarioMin,
      salarioMax,
      descripcion,
      requisitos,
      etiquetas,
      expiraEn,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Error en createJob:", err);
    res.status(500).json({ message: "Error al crear empleo", error: err.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { q, modalidad, tipoContrato } = req.query;

    const filtros = { estado: "activo" };

    if (q) {
      filtros.$or = [
        { titulo: new RegExp(q, "i") },
        { descripcion: new RegExp(q, "i") },
        { ubicacion: new RegExp(q, "i") },
      ];
    }

    if (modalidad) filtros.modalidad = modalidad;
    if (tipoContrato) filtros.tipoContrato = tipoContrato;

    const jobs = await Job.find(filtros)
      .populate("company", "nombre sector")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("Error en getJobs:", err);
    res.status(500).json({ message: "Error al obtener empleos", error: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "company",
      "nombre sector ubicacion sitioWeb descripcion"
    );
    if (!job) return res.status(404).json({ message: "Empleo no encontrado" });

    job.vistas += 1;
    await job.save();

    res.json(job);
  } catch (err) {
    console.error("Error en getJobById:", err);
    res.status(500).json({ message: "Error al obtener empleo", error: err.message });
  }
};

export const getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ company: companyId }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("Error en getCompanyJobs:", err);
    res.status(500).json({ message: "Error al obtener empleos", error: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const companyId = req.company._id;
    const job = await Job.findOne({ _id: req.params.id, company: companyId });

    if (!job) return res.status(404).json({ message: "Empleo no encontrado" });

    Object.assign(job, req.body);
    await job.save();

    res.json(job);
  } catch (err) {
    console.error("Error en updateJob:", err);
    res.status(500).json({ message: "Error al actualizar empleo", error: err.message });
  }
};

export const changeJobStatus = async (req, res) => {
  try {
    const companyId = req.company._id;
    const { estado } = req.body;

    const job = await Job.findOne({ _id: req.params.id, company: companyId });
    if (!job) return res.status(404).json({ message: "Empleo no encontrado" });

    job.estado = estado;
    await job.save();

    res.json(job);
  } catch (err) {
    console.error("Error en changeJobStatus:", err);
    res.status(500).json({ message: "Error al cambiar estado", error: err.message });
  }
};
