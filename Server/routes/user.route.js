import express from 'express';
import verifyUser from '../utils/verifyUser.js';
import { deleteUser, getUser, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.put('/update/:userID', verifyUser, updateUser);
router.delete('/delete/:userID', verifyUser, deleteUser);
router.get('/getUser/:userId', getUser)

export default router;