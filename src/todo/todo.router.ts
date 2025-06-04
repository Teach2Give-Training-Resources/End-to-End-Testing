
import { Express } from 'express';
import { createTodoController, getTodoByIdController, getTodoController, updateTodoController, deleteTodoController, getTodosByUserIdController } from "./todo.controller";
import { adminRoleAuth, bothRoleAuth, userRoleAuth, } from '../middleware/bearAuth';



const todo = (app: Express) => {
    // create todo
    app.route('/todo').post(
        adminRoleAuth,
        async (req, res, next) => {
            try {
                await createTodoController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // get all todos
    app.route('/todos').get(
        adminRoleAuth,
        async (req, res, next) => {
            try {
                await getTodoController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // get todo by id
    app.route('/todo/:id').get(
        bothRoleAuth,
        async (req, res, next) => {
            try {
                await getTodoByIdController(req, res)
            } catch (error) {
                next(error);
            }
        }
    )

    // update todo by id 
    app.route('/todo/:id').put(
        adminRoleAuth,
        async (req, res, next) => {
            try {
                await updateTodoController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //  delete todo by id route
    app.route('/todo/:id').delete(
        adminRoleAuth,
        async (req, res, next) => {
            try {
                await deleteTodoController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
    app.route('/todo/user/:userId').get(
        userRoleAuth,
        async (req, res, next) => {
            try {
                await getTodosByUserIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )


}

export default todo
