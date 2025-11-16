import SavedJob from "../models/SavedJob.js";

export const saveJob = async (req, res) => {
  try {
    const usuario = req.user._id;
    const { empleoId } = req.body;

    const saved = await SavedJob.findOneAndUpdate(
      { usuario, empleo: empleoId },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(saved);
  } catch (err) {
    console.error("Error en saveJob:", err);
    res.status(500).json({ message: "Error al guardar empleo", error: err.message });
  }
};

export const removeSavedJob = async (req, res) => {
  try {
    const usuario = req.user._id;
    const empleoId = req.params.jobId;

    await SavedJob.findOneAndDelete({ usuario, empleo: empleoId });
    res.json({ message: "Empleo eliminado de guardados" });
  } catch (err) {
    console.error("Error en removeSavedJob:", err);
    res.status(500).json({ message: "Error al eliminar guardado", error: err.message });
  }
};

export const getMySavedJobs = async (req, res) => {
  try {
    const usuario = req.user._id;
    const savedJobs = await SavedJob.find({ usuario })
      .populate({
        path: "empleo",
        populate: { path: "company", select: "nombre sector" },
      })
      .sort({ createdAt: -1 });

    res.json(savedJobs);
  } catch (err) {
    console.error("Error en getMySavedJobs:", err);
    res.status(500).json({ message: "Error al obtener guardados", error: err.message });
  }
};
