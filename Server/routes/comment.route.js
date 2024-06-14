import express from 'express';
import verifyUser from '../utils/verifyUser.js'
import { createComment, deleteComment, getComments, updateComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', verifyUser, createComment);
router.get('/get-post-comments/:postId', getComments);
router.patch('/update-comment/:commentId', verifyUser, updateComment);
router.delete('/delete/:userId/:commentId', verifyUser, deleteComment)

export default router;