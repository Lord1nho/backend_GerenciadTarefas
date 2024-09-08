import { db } from "../utils/db.js";

const createTask = async (req, res) => {
    {
        const { userId } = req.params;
        const { title, description } = req.body;
        try {
          // Verifica se o usuário existe
          const user = await db.user.findUnique({
            where: { id: userId },
          });
      
          if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
          }
      
          // Cria o item de todo associado ao usuário
          const todoItem = await db.todoItem.create({
            data: {
              title: title,
              description: description,
              isDone: false,
              userId: userId, // Relaciona com o usuário
            },
          });
      
          res.status(201).json(todoItem);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Erro ao criar o item de todo' });
        }
      };
  };

  const updateTask = async (req, res) => {
    const { userId, taskId } = req.params; // Obtenha userId e taskId dos parâmetros da URL
    const { title, description, isDone } = req.body; // Obtenha os novos valores do corpo da requisição
  
    try {
      // Verifica se o usuário existe
      const user = await db.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      // Verifica se a tarefa pertence ao usuário
      const todoItem = await db.todoItem.findUnique({
        where: { id: parseInt(taskId) },
      });
  
      if (!todoItem) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
  
      if (todoItem.userId !== userId) {
        return res.status(403).json({ error: 'Não autorizado a atualizar esta tarefa' });
      }
  
      // Atualiza a tarefa com os novos valores
      const updatedTodoItem = await db.todoItem.update({
        where: { id: parseInt(taskId) },
        data: {
          title, // Atualiza o título se fornecido
          description, // Atualiza a descrição se fornecido
          isDone, // Atualiza o status de conclusão se fornecido
        },
      });
  
      res.status(200).json(updatedTodoItem); // Retorna o item atualizado
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar a tarefa' });
    }
  };

const getTaskFromUser = async (req, res) => {
  const { userId } = req.params; // Obtenha userId e taskId dos parâmetros da URL

  try {
    // Verifica se o usuário existe
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verifica se a tarefa pertence ao usuário
    const todoItem = await db.todoItem.findMany({
      where: {
        userId: userId,
        isDone: false //apenas vai exibir tarefas não concluídas
      },
    })

    if (todoItem.length === 0) {
      return res.status(404).json({ error: 'Sem tarefas para esse usuário' });
    }

    res.status(200).json(todoItem); // Retorna o item atualizado
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer a requisição' });
  }
};

const deleteTask = async (req, res) => {
  const { userId, taskId } = req.params; // Obtenha userId e taskId dos parâmetros da URL

  try {
    // Verifica se o usuário existe
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verifica se a tarefa pertence ao usuário
    const todoItem = await db.todoItem.findUnique({
      where: { id: parseInt(taskId) },
    });

    if (!todoItem) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    if (todoItem.userId !== userId) {
      return res.status(403).json({ error: 'Não autorizado a excluir esta tarefa' });
    }

    // Exclui a tarefa
    await db.todoItem.delete({
      where: { id: parseInt(taskId) },
    });

    res.status(200).json({ message: 'Tarefa excluída com sucesso' }); // Retorna uma mensagem de sucesso
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir a tarefa' });
  }
};


export default {createTask, updateTask, getTaskFromUser, deleteTask};