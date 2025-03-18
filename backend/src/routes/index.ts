import { Router } from 'express';
import authRouter from './auth';
import projectRouter from './project';
import reminderRouter from './reminder';

const router = Router();

router.use('/auth', authRouter);
router.use('/projects', projectRouter);
router.use('/reminders', reminderRouter);

export default router;
