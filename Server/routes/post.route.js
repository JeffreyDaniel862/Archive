import express from 'express';
import verifyUser from '../utils/verifyUser.js';
import { createPost, deletePost, getPosts, likePost, likesOfPost, savePost, updatePost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create-post/:id', verifyUser, createPost);
router.get('/getposts', getPosts);
router.put('/update/:userId', verifyUser, updatePost)
router.delete('/delete/:postId/:userId', verifyUser, deletePost);
router.put('/like-post/:postId', verifyUser, likePost);
router.get("/likesOfPost/:postId", likesOfPost);
router.put('/save-post/:postId', verifyUser, savePost)

export default router;