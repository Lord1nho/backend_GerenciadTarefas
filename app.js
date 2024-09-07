import express from 'express';
import UserController from './controller/UserController.js'; // Use o caminho correto e extensão .js
import UserTodoList from './controller/UserTodoList.js';
import { addRefreshTokenToWhitelist, findRefreshTokenById, deleteRefreshToken } from './controller/authService.js';
import { findUserById, findUserByEmail } from './controller/userServices.js';
import jwt from 'jsonwebtoken';
const { sign } = jwt;
import { generateTokens } from './utils/jwt.js';
import { hashToken } from './utils/hashToken.js';
import { v4 } from "uuid";


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
app.get('/user/:userId/getTaskByUserId', UserTodoList.getTaskFromUser);
app.get('/user/findUserByEmail', UserController.getIdFromEmail)

app.post('/refreshToken', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error('Missing refresh token.');
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const savedRefreshToken = await findRefreshTokenById(payload.jti);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      res.status(401);
      throw new Error('Unauthorized');
    }

   deleteRefreshToken(savedRefreshToken.id);
    const jti = v4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});