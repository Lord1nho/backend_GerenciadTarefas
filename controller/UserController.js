
import { db } from "../utils/db.js";
  

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await db.user.findUnique({ where: { email } });

    if (user) {
      return res.json({ error: "Usuário já existe" });
    }

    user = await db.user.create({
      data: {
        email,
        password,
      },
    });

    return res.json(user);
  } catch (error) {
    return res.json({ error });
  }
};

const updateUser = async (req, res) => {
    try {
        const {id} = req.params
      const { email, password } = req.body;
  
      let user = await db.user.findUnique({ where: { id: Number(id)}});
  
      if (!user) {
        return res.json({ error: "Usuário Não encontrado" });
      }
  
      user = await db.user.update({
        where: {id: Number(id)},
        data: {email, password},
      });
      return res.json(user);

    } catch (error) {
      return res.json({ error });
    }
  };

  const deleteAllUsers = async (req, res) => {
    try {
        // Deletar todos os usuários
        const result = await db.user.deleteMany({});

        return res.json({ message: `Deletados ${result.count} usuários` });
    } catch (error) {
        console.error(error); // Para depuração
        return res.json({ error: error.message });
    }
};


export default{createUser, updateUser, deleteAllUsers};