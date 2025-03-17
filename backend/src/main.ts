import express from 'express';
import cors from 'cors';
import { AppDataSource } from './dataSource';
import indexRouter from './routes/index';

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use('/', indexRouter);

AppDataSource.initialize()
    .then(() => {
        console.log('[INIT] Connected to database');
        app.listen(port, () => {
            console.log(`[INIT] Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });
