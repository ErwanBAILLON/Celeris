import express from 'express';
import cors from 'cors';
import { AppDataSource } from './dataSource';
import indexRouter from './routes/index';

const app = express();
const port = process.env.BACKEND_PORT || 3000;

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
}));

app.use(express.json());

// Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger';
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
