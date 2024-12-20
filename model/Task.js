const mongoose = require("mongoose");

// Definir o schema
const TaskSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    data: { type: Date, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true }
);

// Exportar o modelo
module.exports = mongoose.model("Task", TaskSchema);
