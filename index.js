const express = require("express");
const mongoose = require("mongoose");
const Task = require("./model/Task");
const app = express();

app.use(express.json());

const mongoURI =
  "mongodb+srv://qa:123qa@cluster0.wx9vx.mongodb.net/to-do-database?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI)
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
  const data = new Date();
  const status = false;

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

  const task = new Task({ titulo, descricao, data, status });
  await task.save();
  res.status(201).json({ message: "Tarefa cadastrada com sucesso!" });
});

app.delete("/api/tarefa/deletar", (req, res) => {
  const titulo = req.body.titulo;
  // const token = req.body.token;
  // if (!token) {
  //   res.status(400).send("Token não encontrado, favor informar.");
  // }
  // if (token != "abc") {
  //   res.status(401).send("Token inválido.");
  // }
  if (!titulo) {
    res.status(404).send("Favor informar o título da tarefa");
    return;
  }
  tarefas = tarefas.filter((elemento) => elemento.titulo != titulo);
  res.status(200).send("Tarefa apagada com sucesso!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
