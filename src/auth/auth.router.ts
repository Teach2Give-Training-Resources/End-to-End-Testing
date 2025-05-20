
import { registerUserController, loginUserController } from './auth.controller';
import { Express } from 'express';


const user = (app: Express) => {
    // regitser
    app.route("/auth/register").post(
        async (req, res, next) => {
            try {
                await registerUserController(req, res);  //call the controller if the validation passes
            } catch (error) {
                next(error);
            }
        }
    );

    // login 
    app.route("/auth/login").post(
        async (req, res, next) => {
            try {
                await loginUserController(req, res)
            } catch (error) {
                next(error)
            }
        }
    );
};

export default user;