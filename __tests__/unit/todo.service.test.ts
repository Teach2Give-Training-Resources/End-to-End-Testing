import {
    createTodoService,
    getTodoService,
    getTodoByIdService,
    updateTodoService,
    deleteTodoService
} from "../../src/todo/todo.service"
import db from "../../src/Drizzle/db"
import { TodoTable } from "../../src/Drizzle/schema"

// mock the modules
jest.mock("../../src/Drizzle/db", () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        TodoTable: {
            findMany: jest.fn(),
            findFirst: jest.fn()
        }
    }

}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Todo Service", () => {
    describe("createTodoService", () => {
        it("should insert a todo and return the inserted todo", async () => {
            const todo = {
                todoName: "Test Todo",
                description: "desc",
                userId: 1,
                dueDate: new Date()
            };  // Mock todo object to be inserted
            const inserted = { id: 1, ...todo };
            // chaining
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([inserted])
                })
            });

            const result = await createTodoService(todo)
            expect(db.insert).toHaveBeenCalledWith(TodoTable)
            expect(result).toEqual(inserted)
        })


        it("should return null if insertion fails", async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([null])
                })
            })

            const todo = {
                todoName: "Fail Todo",
                description: "desc",
                userId: 1,
                dueDate: new Date()
            };

            const result = await createTodoService(todo);
            expect(result).toBeNull()

        })

        //
    })


    describe("getTodosService", () => {
        it("should return all todos", async () => {
            const todos = [
                { id: 1, todoName: "Todo 1", description: "desc 1", userId: 1, dueDate: new Date() },
                { id: 2, todoName: "Todo 2", description: "desc 2", userId: 1, dueDate: new Date() }
            ];
            (db.query.TodoTable.findMany as jest.Mock).mockResolvedValueOnce(todos)

            const result = await getTodoService()
            expect(result).toEqual(todos)
        })

        it("should return empty array if no todos", async () => {
            (db.query.TodoTable.findMany as jest.Mock).mockResolvedValueOnce([])
            const result = await getTodoService()
            expect(result).toEqual([])
        })
    })


    describe("getTodoByIdService", () => {
        it("should return a todo if found", async () => {
            const todo = {
                id: 1,
                todoName: "Todo 1",
                description: "desc",
                userId: 1,
                dueDate: new Date()
            };
            (db.query.TodoTable.findFirst as jest.Mock).mockResolvedValueOnce(todo)

            const result = await getTodoByIdService(1)
            expect(db.query.TodoTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(todo)
        })

        it("should return undefined if not found", async () => {
            (db.query.TodoTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined)
            const result = await getTodoByIdService(9999)
            expect(result).toBeUndefined()
        })


    })

    describe("updateTodoService", () => {
        it("should update a todo and return success message", async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValueOnce(undefined)
                })
            })

            const result = await updateTodoService(1, {
                todoName: "Updated",
                description: "Updated Desc",
                userId: 1,
                dueDate: new Date()
            })

            expect(db.update).toHaveBeenCalledWith(TodoTable)
            expect(result).toBe("Todo updated successfully")
        })
    })

    describe("deleteTodoService", () => {
        it("should delete a todo and return success message", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(undefined)
            })

            const result = await deleteTodoService(1);
            expect(db.delete).toHaveBeenCalledWith(TodoTable)
            expect(result).toBe("Todo deleted successfully");


        })
    })


})