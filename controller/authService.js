import { db } from '../utils/db.js';
import { hashToken } from '../utils/hashToken.js';
import jwt from 'jsonwebtoken';
import { generateTokens } from '../utils/jwt.js';
import { findUserById, findUserByEmail } from '../controller/userServices.js';
import { v4 } from "uuid";

// criação de refreshToken válido
function addRefreshTokenToWhitelist({ jti, refreshToken, userId }) {
  return db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId
    },
  });
}

//  Verificar se token existe no DB
function findRefreshTokenById(id) {
  return db.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

// apaga o token após o uso
function deleteRefreshToken(id) {
  return db.refreshToken.delete({
    where: {
      id,
    }
  });
}

function revokeTokens(userId) {
  return db.refreshToken.updateMany({
    where: {
      userId
    },
  });
}


// Função de atualizar refreshToken (usuário já autenticado).
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error('Missing refresh token.');
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const savedRefreshToken = await findRefreshTokenById(payload.jti);

    //bloco para detecção de erros
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
    //Bloco para apagar refreshToken anterior e Criar outro
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
}

export {
  addRefreshTokenToWhitelist, findRefreshTokenById, deleteRefreshToken, refreshToken};