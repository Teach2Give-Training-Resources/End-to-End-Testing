import express from 'express';
import user from './auth/auth.router';
import todo from './todos/todo.router';

const initializeApp = () => {

    const app = express();
    app.use(express.json())

    // routes
    user(app)
    todo(app)

    // test endpoint
    app.get('/', (req, res) => {
        res.send('Hello World!');
    })

    return app;

}

const app = initializeApp();
// module.exports = app;
export default app;









