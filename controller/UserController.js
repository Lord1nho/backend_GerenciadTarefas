
import { v4 } from "uuid";
import { generateTokens, } from "../utils/jwt.js";
import { findUserByEmail,createUserByEmailAndPassword } from "./userServices.js";
import { compare } from "bcrypt";
import {addRefreshTokenToWhitelist} from './authService.js'
import { db } from "../utils/db.js";


const deleteAllRefreshTokens = async (req, res, next) => {
  try {
    const deleteCount = await db.refreshToken.deleteMany();
    return res.json({ message: `${deleteCount.count} refresh tokens deleted successfully` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteAllUsers = async (req, res, next) => {
  try {
    const deleteCount = await db.user.deleteMany();
    return res.json({ message: `${deleteCount.count} users deleted successfully` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const listAllUsers = async (req, res, next) => {
  try {

    const users = await db.user.findMany();
    return res.json(users)

  } catch (error) {
    return (
      {error}
    )
  }
}

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('You must provide an email and a password.');
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400);
      throw new Error('Email already in use.');
    }

    const user = await createUserByEmailAndPassword({ email, password });
    const jti = v4();
    const { accessToken, refreshToken } = generateTokens(user, jti);

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

  const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400);
        throw new Error('You must provide an email and a password.');
      }
  
      const existingUser = await findUserByEmail(email);
  
      if (!existingUser) {
        res.status(403);
        throw new Error('Invalid login credentials.');
      }
  
      const validPassword = await compare(password, existingUser.password);
      if (!validPassword) {
        res.status(403);
        throw new Error('Invalid login credentials.');
      }
  
      const jti = v4();
      const { accessToken, refreshToken } = generateTokens(existingUser, jti);
      await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id });
  
      res.json({
        accessToken,
        refreshToken
      });
    } catch (err) {
      next(err);
    }
  }

export default{registerUser, login, listAllUsers, deleteAllRefreshTokens, deleteAllUsers};