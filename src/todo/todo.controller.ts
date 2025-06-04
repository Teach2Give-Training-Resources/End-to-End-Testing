
import { Request, Response } from "express";
import {
    createTodoService, getTodoService, getTodoByIdService,
    updateTodoService, deleteTodoService, getTodosByUserIdService
} from "./todo.service";

// create a todo controller
export const createTodoController = async (req: Request, res: Response) => {
    try {
        const todo = req.body

        // Convert dueDate to a Date object if provided
        if (todo.dueDate) {
            todo.dueDate = new Date(todo.dueDate)
        }

        const newTodo = await createTodoService(todo)
        if (!newTodo) {
            return res.status(400).json({ messge: "Todo not created" })
        }
        return res.status(201).json({ message: "Todo created successfully", todo: newTodo })

    } catch (error: any) {
        return res.status(500).json({ error: error.message });

    }
}

// get all todos controller
export const getTodoController = async (req: Request, res: Response) => {
    try {
        const todos = await getTodoService()
        if (!todos || todos.length === 0) {
            return res.status(404).json({ message: "No todos found" })
        }
        return res.status(200).json({ data: todos })


    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// get todo by id controller
export const getTodoByIdController = async (req: Request, res: Response) => {
    try { //"1" - 1 

        //"jgdsjgd"
        const id = parseInt(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" })
        }

        const todo = await getTodoByIdService(id)
        if (!todo) { //20
            return res.status(404).json({ message: "Todo not found" })
        }
        return res.status(200).json({ data: todo });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });

    }
}

// update todo by id controller
export const updateTodoController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        // 3
        const todo = req.body;

        // Convert dueDate to a Date object if provided
        if (todo.dueDate) {
            todo.dueDate = new Date(todo.dueDate);
        }

        // check if it exist -   // 3
        const existingTodo = await getTodoByIdService(id)
        if (!existingTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        const updatedTodo = await updateTodoService(id, todo)
        if (!updatedTodo) {
            return res.status(400).json({ message: "Todo not updated" });
        }
        return res.status(200).json({ message: "Todo updated successfully" });

    } catch (error: any) {
        return res.status(500).json({ error: error.message });

    }
}

// delete todo by id 
export const deleteTodoController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const existingTodo = await getTodoByIdService(id);
        if (!existingTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        const deleted = await deleteTodoService(id);
        if (!deleted) {
            return res.status(400).json({ message: "Todo not deleted" });
        }
        return res.status(204).json({});

    } catch (error: any) {
        return res.status(500).json({ error: error.message });

    }
}

export const getTodosByUserIdController = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        const todos = await getTodosByUserIdService(userId);
        if (!todos || todos.length === 0) {
            return res.status(404).json({ message: "No todos found for this user" });
        }
        return res.status(200).json({ data: todos });

    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
    

}


