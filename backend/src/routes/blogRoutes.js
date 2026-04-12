import express from 'express';
import { getBlogs, getBlogBySlug, addComment } from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/:slug/comments', protect, addComment);

export default router;
