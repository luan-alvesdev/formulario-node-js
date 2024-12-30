const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("./model/Task");
const swaggerSetup = require("./swagger");
const swagger = require("./swagger");
const app = express();

app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.mongo_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

swaggerSetup(app);

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

  const task = new Task({ titulo, descricao });
  const objetoDeRetorno = await task.save();
  res.status(201).json(objetoDeRetorno);
});

app.put("/api/tarefa/editar/:id", async (req, res) => {
  const id = req.params.id;
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;

  // Verificar se a tarefa fornecida existe
  if (!titulo || !descricao) {
    return res
      .status(400)
      .json({ error: "Título e descrição são obrigatórios." });
  }

  try {
    const task = await Task.findByIdAndUpdate(
      id,
      { titulo, descricao },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }
    res
      .status(200)
      .json({ message: "Status da tarefa atualizado com sucesso!", task });
  } catch (err) {
    console.error("Erro ao atualizar tarefa:", err);
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - titulo
 *         - descricao
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: ID da tarefa
 *         titulo:
 *           type: string
 *           description: Título da tarefa
 *         descricao:
 *           type: string
 *           description: Descrição da tarefa
 *         status:
 *           type: string
 *           enum: [TODO, DOING, DONE]
 *           description: Status da tarefa
 *       example:
 *         id: 60d0fe4f5311236168a109ca
 *         titulo: "Minha Tarefa"
 *         descricao: "Descrição da minha tarefa"
 *         status: "TODO"
 */

/**
 * @swagger
 * /api/tarefa/listar:
 *   get:
 *     summary: Lista todas as tarefas
 *     tags: [Task]
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Erro ao listar tarefas
 */

/**
 * @swagger
 * /api/tarefa/cadastrar:
 *   post:
 *     summary: Cadastra uma nova tarefa
 *     tags: [Task]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Tarefa cadastrada com sucesso
 *       400:
 *         description: Erro de validação
 *       409:
 *         description: Conflito - Tarefa já existe
 *       500:
 *         description: Erro ao cadastrar tarefa
 */

/**
 * @swagger
 * /api/tarefa/editar/{id}:
 *   put:
 *     summary: Edita uma tarefa existente
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro ao atualizar tarefa
 */

/**
 * @swagger
 * /api/tarefa/editar/status/{id}:
 *   patch:
 *     summary: Atualiza o status de uma tarefa
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [TODO, DOING, DONE]
 *     responses:
 *       200:
 *         description: Status da tarefa atualizado com sucesso
 *       400:
 *         description: Status inválido
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro ao atualizar status da tarefa
 */

/**
 * @swagger
 * /api/tarefa/deletar/{id}:
 *   delete:
 *     summary: Deleta uma tarefa
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa apagada com sucesso
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro ao deletar tarefa
 */
