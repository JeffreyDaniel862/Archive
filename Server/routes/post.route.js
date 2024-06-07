import express from 'express';
import verifyUser from '../utils/verifyUser.js';
import { createPost, deletePost, getPosts, updatePost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create-post/:id', verifyUser, createPost);
router.get('/getposts', getPosts);
router.put('/update/:userId', verifyUser, updatePost)
router.delete('/delete/:postId/:userId', verifyUser, deletePost);

export default router;