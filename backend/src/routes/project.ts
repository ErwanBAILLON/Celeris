import express from 'express';
import { Project, Task } from '../entities';
import { ProjectRepository, UserRepository, TaskRepository } from '../repositories';
import { authMiddleware } from '../middlewares/authMiddleware';

const projectRouter = express.Router();

const projectExporter: (project: Project) => object = (project: Project) => {
    return {
        id: project.id,
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
    }
}

const taskExporter: (task: Task) => object = (task: Task) => {
    return {
        id: task.id,
        name: task.name,
        description: task.description,
        startDate: task.startDate,
        endDate: task.endDate,
        status: task.status,
        priority: task.priority,
        tags: task.tags,
    }
}

projectRouter.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.userId;
        const projects = await ProjectRepository.findByUserId(userId);
        const exportedProjects = projects.map(projectExporter);
        res.status(200).json(exportedProjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

projectRouter.get('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const project = await ProjectRepository.findById(id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        if (project.user.id !== userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        const exportedProject = projectExporter(project);
        res.status(200).json(exportedProject);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});

projectRouter.post('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.userId;
        const user = await UserRepository.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const { name, description, startDate, endDate } = req.body;
        const project = new Project();
        project.name = name;
        project.description = description;
        project.startDate = startDate;
        project.endDate = endDate;
        project.user = user;
        const createdProject = await ProjectRepository.create(project);
        if (!createdProject) {
            res.status(500).json({ error: 'Failed to create project' });
            return;
        }
        res.status(201).json(projectExporter(createdProject));
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});

projectRouter.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        const { name, description, startDate, endDate } = req.body;
        const project = await ProjectRepository.findById(id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        if (project.user.id !== userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        project.name = name;
        project.description = description;
        project.startDate = startDate;
        project.endDate = endDate;
        const updatedProject = await ProjectRepository.update(project);
        if (!updatedProject) {
            res.status(500).json({ error: 'Failed to update project' });
            return;
        }
        res.status(200).json(projectExporter(updatedProject));
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});

projectRouter.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        const project = await ProjectRepository.findById(id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        if (project.user.id !== userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        await ProjectRepository.delete(project);
        const response = {
            message: 'Project deleted successfully',
        }
        res.status(200).json(response);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});

projectRouter.post('/:id/tasks', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        const { name, description, startDate, endDate, status, priority } = req.body;
        const project = await ProjectRepository.findById(id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        if (project.user.id !== userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        const task = new Task();
        task.name = name;
        task.description = description;
        task.startDate = startDate;
        task.endDate = endDate;
        task.status = status;
        task.priority = priority;
        task.project = project;
        const createdTask = await TaskRepository.create(task);
        if (!createdTask) {
            res.status(500).json({ error: 'Failed to create task' });
            return;
        }
        res.status(201).json(taskExporter(createdTask));
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});

projectRouter.get('/:id/tasks', authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const project = await ProjectRepository.findById(id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        if (project.user.id !== userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        const tasks = await TaskRepository.findByProjectId(id);
        const exportedTasks = tasks.map(taskExporter);
        res.status(200).json(exportedTasks);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});

projectRouter.get('/:id/tasks/:taskId', authMiddleware, async (req, res) => {
    try {
        const { id, taskId } = req.params;
        const userId = req.user!.userId;
        const project = await ProjectRepository.findById(id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        const task = await TaskRepository.findById(taskId);
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        if (project.user.id !== userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        const exportedTask = taskExporter(task);
        res.status(200).json(exportedTask);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});

projectRouter.put('/:id/tasks/:taskId', authMiddleware, async (req, res) => {
    try {
        const { id, taskId } = req.params;
        const userId = req.user!.userId;
        const { name, description, startDate, endDate } = req.body;
        const project = await ProjectRepository.findById(id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        const task = await TaskRepository.findById(taskId);
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        if (project.user.id !== userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        task.name = name;
        task.description = description;
        task.startDate = startDate;
        task.endDate = endDate;
        const updatedTask = await TaskRepository.update(task);
        if (!updatedTask) {
            res.status(500).json({ error: 'Failed to update task' });
            return;
        }
        res.status(200).json(taskExporter(updatedTask));
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});

projectRouter.delete('/:id/tasks/:taskId', authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.userId;
        const { id, taskId } = req.params;
        const project = await ProjectRepository.findById(id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        const task = await TaskRepository.findById(taskId);
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        if (project.user.id !== userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        await TaskRepository.delete(task);
        const response = {
            message: 'Task deleted successfully',
        }
        res.status(200).json(response);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});

export default projectRouter;
