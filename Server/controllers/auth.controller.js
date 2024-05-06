import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/errorHandler.js';
import jwt from 'jsonwebtoken';
import '../env.js'

export const signUp = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    try {
        const user = await User.create({ username, email, password: hashedPassword });
        res.json({ message: "SignUp Successfull", statusCode: 201 });
    } catch (error) {
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ where: { email } });
        if (!validUser) return next(errorHandler(404, "User not found"));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(404, "Email or Password is incorrect"));
        const user = { id: validUser.id, username: validUser.username, email: validUser.email, createdAt: validUser.createdAt, updatedAt: validUser.updatedAt }
        const token = jwt.sign({ id: validUser.id }, process.env.JWT_MAGIC);
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(user);
    } catch (error) {

    }
}