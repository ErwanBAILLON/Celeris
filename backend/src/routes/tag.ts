import { Router, Request, Response } from 'express';
import { Tag } from '../entities/Tag';
import { AppDataSource } from '../dataSource';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const tagRepository = AppDataSource.getRepository(Tag);

// Get all tags for the authenticated user
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userId = req.user.userId;
    const tags = await tagRepository.find({
      where: { user: { id: userId } }
    });
    
    return res.json(tags);
  } catch (error) {
    console.error('Error getting tags:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create a new tag
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { name, color, description } = req.body;
    const userId = req.user.userId;
    
    // Check if tag with the same name already exists for this user
    const existingTag = await tagRepository.findOne({
      where: { 
        name, 
        user: { id: userId } 
      }
    });
    
    if (existingTag) {
      return res.status(400).json({ message: 'Tag with this name already exists' });
    }
    
    const tag = new Tag();
    tag.name = name;
    tag.color = color;
    tag.description = description;
    tag.user = { id: userId } as any;
    
    await tagRepository.save(tag);
    
    return res.status(201).json({ message: 'Tag created' });
  } catch (error) {
    console.error('Error creating tag:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get a tag by ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const tagId = parseInt(req.params.id);
    const userId = req.user.userId;
    
    const tag = await tagRepository.findOne({
      where: { 
        id: tagId, 
        user: { id: userId } 
      }
    });
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    
    return res.json(tag);
  } catch (error) {
    console.error('Error getting tag:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update a tag
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const tagId = parseInt(req.params.id);
    const userId = req.user.userId;
    const { name, color, description } = req.body;
    
    const tag = await tagRepository.findOne({
      where: { 
        id: tagId, 
        user: { id: userId } 
      }
    });
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    
    // Update the tag
    if (name) tag.name = name;
    if (color) tag.color = color;
    if (description !== undefined) tag.description = description;
    
    await tagRepository.save(tag);
    
    return res.json({ message: 'Tag updated' });
  } catch (error) {
    console.error('Error updating tag:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete a tag
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const tagId = parseInt(req.params.id);
    const userId = req.user.userId;
    
    const tag = await tagRepository.findOne({
      where: { 
        id: tagId, 
        user: { id: userId } 
      }
    });
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    
    await tagRepository.remove(tag);
    
    return res.json({ message: 'Tag deleted' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router; 
