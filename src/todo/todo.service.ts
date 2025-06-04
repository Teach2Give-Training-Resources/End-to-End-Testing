import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { TITodo, TodoTable } from "../Drizzle/schema";

// CRUD

// create a todo
export const createTodoService = async (todo: TITodo) => {
    const [inserted] = await db.insert(TodoTable).values(todo).returning()
    if (inserted) {
        return inserted
    }
    return null
}

// Get all todos
export const getTodoService = async () => {
    const todos = await db.query.TodoTable.findMany()
    return todos;
}

// get todo by id
export const getTodoByIdService = async (id: number) => {
    const todo = await db.query.TodoTable.findFirst({
        where: eq(TodoTable.id, id)
    })
    return todo
}

// update todo by id
export const updateTodoService = async (id: number, todo: TITodo) => {
    await db.update(TodoTable).set(todo).where(eq(TodoTable.id, id))
    return "Todo updated successfully";
}

// delete todo by id
export const deleteTodoService = async (id: number) => {
    await db.delete(TodoTable).where(eq(TodoTable.id, id))
    return "Todo deleted successfully";
}

// get all todos by user id
export const getTodosByUserIdService = async (userId: number) => {
    const todos = await db.query.TodoTable.findMany({
        where: eq(TodoTable.userId, userId)
    });
    return todos;
}