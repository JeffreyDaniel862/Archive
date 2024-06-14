import savedPost from "../models/savedPost.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js"
import bcryptjs from 'bcryptjs';

export const updateUser = async (req, res, next) => {
    if (req.user.id != req.params.userID) {
        return next(errorHandler(401, "Unauthorized to update this account"));
    }

    if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    try {
        await User.update(req.body, { where: { id: req.params.userID } });
        const user = await User.findOne({ where: { id: req.params.userID } });
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            displayPicture: user.displayPictureURL,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            statusCode: 200
        });
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id != req.params.userID) {
        return next(errorHandler(401, "Unauthorized to delete this account"));
    }
    try {
        await User.destroy({ where: { id: req.params.userID } });
        res.clearCookie('access_token').status(200).json({ message: "Account Deleted", success: true });
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const userInfo = await User.findOne({ where: { id: req.params.userId } })
        const user = { username: userInfo.username, email: userInfo.email, displayPicture: userInfo.displayPictureURL }
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}

export const getUserSavedPost = async (req, res, next) => {
    const userId = req.params.userId;
    if (req.user.id != userId) {
        next(errorHandler(403, 'Access denied'));
    }
    try {
        const { count, rows: userSavedPost } = await savedPost.findAndCountAll({
            where: {
                userId,
                ...(req.query.postId && { postId: req.query.postId })
            }
        });
        res.status(200).json({ count, userSavedPost });
    } catch (error) {
        next(error);
    }
}