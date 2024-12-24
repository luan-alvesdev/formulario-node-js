# API de Gestão de Tarefas

Este projeto é uma API de gestão de tarefas desenvolvida com Node.js, Express e MongoDB. A API permite criar, listar, editar e deletar tarefas. Cada tarefa possui um título, descrição e status (TODO, DOING, DONE).

## Funcionalidades

- **Cadastrar Tarefa**: Adiciona uma nova tarefa.
- **Editar Tarefa**: Altera o título e a descrição de uma tarefa existente.
- **Atualizar Status da Tarefa**: Altera o status de uma tarefa existente.
- **Deletar Tarefa**: Remove uma tarefa pelo ID.

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Swagger

## Instalação

1. Clone o repositório:

```sh
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
```

2. Instale as dependências:

```
npm install
```

3. Crie um arquivo .env na raiz do projeto com a seguinte variável de ambiente:

```
mongo_URI=mongodb+srv://<usuario>:<senha>@cluster0.mongodb.net/<nome-do-banco>?retryWrites=true&w=majority
```

4. Inicie o servidor:

```
npm run start
```

Documentação da API
A documentação da API é gerada automaticamente pelo Swagger. Para acessar a documentação, inicie o servidor e acesse o seguinte caminho no seu navegador:

```
http://localhost:3000/api-docs
```

Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.
