import express from 'express';
import UserController from './controller/UserController.js'; // Use o caminho correto e extensão .js
import UserTodoList from './controller/UserTodoList.js';
import {  refreshToken } from './controller/authService.js';

const app = express();
const port = 3001;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/user', UserController.registerUser);
app.post('/login', UserController.login);
app.delete('/user/:userId/:taskId/deleteTask', UserTodoList.deleteTask);
app.post('/user/:userId/createTask', UserTodoList.createTask);
app.patch('/user/:userId/:taskId/updateTask', UserTodoList.updateTask);
app.get('/user/getAllUsers', UserController.listAllUsers);
app.get('/user/:userId/getTaskByUserId', UserTodoList.getTaskFromUser);
app.get('/user/findUserByEmail', UserController.getIdFromEmail)
app.post('/refreshToken', refreshToken) 



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});