import { TITodo, TSTodo, TodoTable } from "../drizzle/schema";

import db from "../drizzle/db";
import { eq, sql } from "drizzle-orm";

// create a todo
export const createTodoService = async (todo: TITodo): Promise<string | null> => {
    await db.insert(TodoTable).values(todo);
    return "Todo Created Successfully";
}

// get all orders
export const getTodosService = async (): Promise<TSTodo[] | null> => {
    const todos = await db.query.TodoTable.findMany();
    return todos;
}

// get todo by id
export const getTodoByIdService = async (id: number): Promise<TSTodo | undefined> => {
    const todo = await db.query.TodoTable.findFirst({
        where: eq(TodoTable.id, id)
    })
    return todo;
}

// update todo
export const updateTodoService = async (id: number, todo: TITodo) => {
    await db.update(TodoTable).set(todo).where(eq(TodoTable.id, id));
    return "Todo Updated Successfully"
}

// delete todo
export const deleteTodoService = async (id: number) => {
    await db.delete(TodoTable).where(eq(TodoTable.id, id));
    return "Todo deleted Successfully"
}