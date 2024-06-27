import express from 'express';
import verifyUser from '../utils/verifyUser.js';
import { deleteUser, followUser, getAnalytics, getSavedPosts, getUser, getUserFollowers, getUserFollowing, getUserSavedPost, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.put('/update/:userID', verifyUser, updateUser);
router.delete('/delete/:userID', verifyUser, deleteUser);
router.get('/getUser', getUser);
router.get('/getUserSavedPost/:userId', verifyUser, getUserSavedPost);
router.post('/follow-user/:userId', verifyUser, followUser);
router.get('/get-followers/:userId', getUserFollowers);
router.get('/get-following/:userId', getUserFollowing);
router.get('/getAnalytics/:userId', verifyUser, getAnalytics);
router.get('/getSavedPosts/:userId', verifyUser, getSavedPosts);

export default router;