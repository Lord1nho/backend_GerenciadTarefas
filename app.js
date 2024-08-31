import express from 'express';
import UserController from './controller/UserController.js'; // Use o caminho correto e extensão .js

const app = express();
const port = 3000;

app.use(express.json());


app.post('/user', UserController.createUser);
app.delete('/delUser', UserController.deleteAllUsers);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});