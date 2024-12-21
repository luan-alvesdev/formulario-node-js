const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("./model/Task");
const app = express();

app.use(express.json());

mongoose
  .connect(process.env.mongo_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

let tarefas = [];

app.get("/api/tarefa/listar", async (req, res) => {
  try {
    const todo = await Task.find(); // Aguarda a consulta ao banco
    res.status(200).json(todo); // Envia o resultado como JSON
  } catch (err) {
    console.error("Erro ao listar tarefas:", err);
    res.status(500).send("Erro ao listar tarefas");
  }
});

app.post("/api/tarefa/cadastrar", async (req, res) => {
  // desta forma garanto estar pegando apenas os valores que eu quero
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;

  //verificação para garantir não enviar números no título
  if (typeof titulo !== "string") {
    res
      .status(400)
      .json({ error: "Favor informar um título válido para a tarefa." });
    return;
  }
  if (!titulo || !descricao) {
    res.status(400).send("Os campos titulo e descrição devem ser preenchidos.");
    return;
  }

  // Verificar no banco se já existe uma tarefa com o mesmo título ou descrição
  const tarefaExistente = await Task.findOne({
    $or: [{ titulo }, { descricao }],
  });

  if (tarefaExistente) {
    return res
      .status(409) // 409 = Conflito
      .json({
        error: "Já existe uma tarefa com este título ou descrição.",
      });
  }

  const task = new Task({ titulo, descricao });
  await task.save();
  res.status(201).json({ message: "Tarefa cadastrada com sucesso!" });
});

app.patch("/api/tarefa/editar/status/:id", async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  // Verificar se o status fornecido é válido
  const validStatuses = ["TODO", "DOING", "DONE"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Status inválido." });
  }

  try {
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }
    res
      .status(200)
      .json({ message: "Status da tarefa atualizado com sucesso!", task });
  } catch (err) {
    console.error("Erro ao atualizar status da tarefa:", err);
    res.status(500).json({ error: "Erro ao atualizar status da tarefa" });
  }
});

app.delete("/api/tarefa/deletar/:id", async (req, res) => {
  const id = req.params.id;

  const task = await Task.findByIdAndDelete(id);

  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." }); // 404 = Not Found
  }
  res.status(200).send("Tarefa apagada com sucesso!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
