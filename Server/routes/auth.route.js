import express from 'express';
import { Oauth, signIn, signUp } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/Oauth', Oauth)

export default router;