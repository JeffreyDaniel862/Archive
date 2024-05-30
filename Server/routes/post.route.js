import express from 'express';
import verifyUser from '../utils/verifyUser.js';
import { createPost, getPosts } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create-post/:id', verifyUser, createPost);
router.get('/getposts', getPosts)

export default router;