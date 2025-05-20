import { createTodoController, getTodosController, getTodoByIdController, updateTodoController, deleteTodoController } from './todo.controller';
import { isAuthenticated } from '../middleware/bearAuth';
import { Express } from 'express';

const todo = (app: Express) => {
    // create todo
    app.route("/todo").post(
        isAuthenticated,
        async (req, res, next) => {
            try {
                await createTodoController(req, res);
            } catch (error: any) {
                next(error);
            }
        }
    );

    // get all todos
    app.route("/todo").get(
        isAuthenticated,
        async (req, res, next) => {
            try {
                await getTodosController(req, res);
            } catch (error: any) {
                next(error);
            }
        }
    );

    // get todo by id
    app.route("/todo/:id").get(
        isAuthenticated,
        async (req, res, next) => {
            try {
                await getTodoByIdController(req, res);
            } catch (error: any) {
                next(error);
            }
        }
    );

    // update todo
    app.route("/todo/:id").put(
        isAuthenticated,
        async (req, res, next) => {
            try {
                await updateTodoController(req, res);
            } catch (error: any) {
                next(error);
            }
        }
    );

    // delete todo
    app.route("/todo/:id").delete(
        isAuthenticated,
        async (req, res, next) => {
            try {
                await deleteTodoController(req, res);
            } catch (error: any) {
                next(error);
            }
        }
    );

}

export default todo;