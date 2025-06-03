import {
    createTodoService,
    getTodosService,
    getTodoByIdService,
    updateTodoService,
    deleteTodoService
} from "../../src/todos/todo.service";

import db from "../../src/drizzle/db";
import { TodoTable } from "../../src/drizzle/schema";

// Mock the entire db module
jest.mock("../../src/drizzle/db", () => ({
    insert: jest.fn(), // jest.fn() is used to create a mock function - means that this function can be called and its calls can be tracked
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        TodoTable: {
            findMany: jest.fn(),
            findFirst: jest.fn()
        }
    }
}));

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
            }; // Mock todo object to be inserted
            const inserted = { id: 1, ...todo }; //this is the expected inserted todo object

            // Proper chaining mock
            (db.insert as jest.Mock).mockReturnValue({ // Mock the insert method - mockReturnValue is used to specify what the mock function should return when called
                values: jest.fn().mockReturnValue({ // Mock the values method, which is called after insert - this is used to specify the values to be inserted, in this case the todo object { ...todo }
                    returning: jest.fn().mockResolvedValueOnce([inserted])// Mock the returning method, which is called after values - mockResolvedValueOnce is used to specify what the mock function should return when called, in this case an array with the inserted todo object
                })
            });

            const result = await createTodoService(todo);
            expect(db.insert).toHaveBeenCalledWith(TodoTable);
            expect(result).toEqual(inserted);
        });

        it("should return null if insertion fails", async () => {
            (db.insert as jest.Mock).mockReturnValue({// Mock the insert method
                // Mock the values method, which is called after insert
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([undefined])
                })
            });

            const todo = {
                todoName: "Fail Todo",
                description: "desc",
                userId: 1,
                dueDate: new Date()
            };

            const result = await createTodoService(todo);
            expect(result).toBeNull();
        });
    });

    describe("getTodosService", () => {
        it("should return all todos", async () => {
            const todos = [
                { id: 1, todoName: "Todo 1", description: "desc 1", userId: 1, dueDate: new Date() },
                { id: 2, todoName: "Todo 2", description: "desc 2", userId: 1, dueDate: new Date() }
            ];
            (db.query.TodoTable.findMany as jest.Mock).mockResolvedValueOnce(todos);

            const result = await getTodosService();
            expect(result).toEqual(todos);

        });

        it("should return empty array if no todos", async () => {
            (db.query.TodoTable.findMany as jest.Mock).mockResolvedValueOnce([]);
            const result = await getTodosService();
            expect(result).toEqual([]);
        });
    });

    describe("getTodoByIdService", () => {
        it("should return a todo if found", async () => {
            const todo = { id: 1, todoName: "Todo 1", description: "desc", userId: 1, dueDate: new Date() };
            (db.query.TodoTable.findFirst as jest.Mock).mockResolvedValueOnce(todo);

            const result = await getTodoByIdService(1);
            expect(db.query.TodoTable.findFirst).toHaveBeenCalled();
            expect(result).toEqual(todo);
        });

        it("should return undefined if not found", async () => {
            (db.query.TodoTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);
            const result = await getTodoByIdService(999);
            expect(result).toBeUndefined();
        });
    });

    describe("updateTodoService", () => {
        it("should update a todo and return success message", async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValueOnce(undefined) //undefined means that the update was successful, this is because we are not returning anything from the update method 
                })
            });
            type TodoUpdate = {
                todoName: string;
                description: string;
                userId: number;
                dueDate: Date;
            }
            const result = await updateTodoService(1, {
                todoName: "Updated",
                description: "Updated Desc",
                userId: 1,
                dueDate: new Date()
            } as TodoUpdate);

            expect(db.update).toHaveBeenCalledWith(TodoTable);
            expect(result).toBe("Todo Updated Successfully");
        });
    });

    describe("deleteTodoService", () => {
        it("should delete a todo and return success message", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(undefined) 
            });

            const result = await deleteTodoService(1);
            expect(db.delete).toHaveBeenCalledWith(TodoTable);
            expect(result).toBe("Todo deleted Successfully");
        });
    });
});
