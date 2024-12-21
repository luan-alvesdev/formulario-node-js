const mongoose = require("mongoose");

// Definir o schema
const TaskSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    status: {
      type: String,
      enum: ["TODO", "DOING", "DONE"],
      default: "TODO",
      required: true,
    },
  },
  { timestamps: true }
);

// Exportar o modelo
module.exports = mongoose.model("Task", TaskSchema);
