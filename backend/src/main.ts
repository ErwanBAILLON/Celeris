import express from 'express';
import cors from 'cors';
import { AppDataSource } from './dataSource';
import indexRouter from './routes/index';

const app = express();
const port = process.env.BACKEND_PORT || 3000;

// Middleware setup
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
}));

app.use(express.json());

// Swagger setup
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger';
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/', indexRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

// Database connection and server startup
const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('[INIT] Connected to database');
        
        app.listen(port, () => {
            console.log(`[INIT] Server running on port ${port}`);
        });
    } catch (err) {
        console.error('[ERROR] Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
