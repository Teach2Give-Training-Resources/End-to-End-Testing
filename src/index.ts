import express from 'express';
import user from './auth/auth.router';
import todo from './todo/todo.router';

const initilizeApp = () => {
    const app = express();
    app.use(express.json()); //used to parse JSON bodies

    // routes
    user(app);
    todo(app);

    app.get('/', (req, res) => {
        res.send('Hello, World!');
    })

    return app;

}

const app = initilizeApp();
export default app;


