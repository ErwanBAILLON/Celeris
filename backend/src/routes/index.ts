import { Router } from 'express';
import authRoutes from './auth';
import projectRoutes from './project';
import reminderRoutes from './reminder';
import tagRoutes from './tag';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/reminders', reminderRoutes);
router.use('/tags', tagRoutes);

export default router;
