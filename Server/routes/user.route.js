import express from 'express';
import verifyUser from '../utils/verifyUser.js';
import { deleteUser, getUser, getUserSavedPost, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.put('/update/:userID', verifyUser, updateUser);
router.delete('/delete/:userID', verifyUser, deleteUser);
router.get('/getUser/:userId', getUser);
router.get('/getUserSavedPost/:userId', verifyUser, getUserSavedPost);

export default router;