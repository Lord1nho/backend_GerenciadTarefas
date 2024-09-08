# Back-End - Gerenciador de Tarefas

### Tecnologias: Node, Express, Prisma.

### *OBS:* **necessário ter o node instalado na máquina**
---
## Guia de Instalação

1. Clone esse repositório (recomendado fazer um fork) na sua máquina utilizando o comando:
`git clone @webURLdoprojeto`
2. Abra um terminal na pasta que o projeto foi clonado (cmd do Windows ou terminal da IDE que vc estiver utilizando)
3. Utilize o comando `npm i` para instalar as dependências do projeto
4. Crie um arquivo `.env` e crie as seguintes variáveis de ambiente: (**isso vai ser necessário para alguns recursos, então o configure de imediato**)
- `JWT_ACCESS_SECRET= crie senha de acesso aqui`
-  `JWT_REFRESH_SECRET = crie senha de acesso aqui` 
 5. Tudo Pronto, você pode rodar o seu projeto utilizando o `node app.js` E utilizar postman ou insomnia para testar as requisições. <3
---

## Funcionalidades
>utils
- Pasta `utils`: Nela se encontram os arquivos `db.js`, `jwt.js` e `hashToken.js`. 
São os arquivos de inicialização do banco, funções para gerar Tokens JWT, e processo para criptografia dos Tokens.

>Controller
1. `userController`:
- `authService`: Todas as funcionalidades voltadas aos serviços que suportam a autenticação e autorização no sistema (utilizando JWT) 
- `userServices`: Todas as funcionalidades voltadas aos serviços que suportam a parte de criação de usuários no sistema (trabalhando juntamente com o `authService`)
- `userController`: Onde estão concentradas as funcionalidades que utilizam do `authService` e `userServices`, realizando login, registro e algumas funcionalidades de busca em banco
- `userTodoList`: Onde estão concentradas as funcionalidades para o CRUD do gerenciador de tarefas (Criar, Visualizar, Marcar Tarefas como prontas e excluir tarefas)
---
>Algumas convenções

- `db`: Inicializar e acessar banco de dados utilizando prisma 
- `JWT_ACCESS_SECRET` e `JWT_REFRESH_SECRET`: Váriaveis de ambiente para acessar tokens e refreshTokens (lembrando que elas devem ser criadas)

>Tipos de Requisições

*Todas as rotas para requisições estão disponíveis no arquivo `app.js`

- Requisições Registro e Login (*apenas enviar dados via req.body*)
 ```
{
    "email": "teste@teste.com",
    "password": "teste2024"
}
```
- Requisições de Criar task e Exibir Tasks (para 1 usuário)

```
{
  "title": "Estudar Prisma",
  "description": "Aprender a integrar Prisma com Node.js"
}

get Task: /user/:coloque o id do usuário: ex: /getTaskByUserId

Para testes, pode utilizar o app.get('/user/getAllUsers', UserController.listAllUsers); para pegar o ID de um usuário.
```

- Requisições para update e delete em Task

```
Crie uma tarefa para um usuário, pegue o id do usuário, e o id da tarefa para excluir nessa requisição:

app.delete('/user/:userId/:taskId/deleteTask', UserTodoList.deleteTask);
app.patch('/user/:userId/:taskId/updateTask', UserTodoList.updateTask);
```

## Propósito

A construção dessa API é foi voltada para um processo seletivo para estágio.

>Documentações e Referências

- [Express.js](https://www.npmjs.com/package/express)
- [Prisma-npm](https://www.npmjs.com/package/prisma/)
- [PrismaORM](https://www.prisma.io/)
- [JWT autenthication and authorization](https://dev.to/mihaiandrei97/jwt-authentication-using-prisma-and-express-37nk)

---
### Criado por [Luiz Fernando](https://github.com/Lord1nho) <3
