import { hash } from 'bcrypt';
import {db} from '../utils/db.js'

function findUserByEmail(email) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

async function createUserByEmailAndPassword(user) {
  user.password = await hash(user.password, 12);
  return db.user.create({
    data: user,
  });
}

function findUserById(id) {
  return db.user.findUnique({
    where: {
      id,
    },
  });
}

export{
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword
};