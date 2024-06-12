import express from 'express';
import verifyUser from '../utils/verifyUser.js'
import { createComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', verifyUser, createComment)

export default router;