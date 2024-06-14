import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/errorHandler.js"

export const createComment = async (req, res, next) => {
    if (req.user.id != req.body.userId) {
        return next(errorHandler(403, 'Access denied'));
    }
    const comment = { postId: req.body.postId, userId: req.body.userId, content: req.body.content }
    try {
        await Comment.create(comment);
        res.status(200).json({ message: 'commented successfully', statusCode: 200 });
    } catch (error) {
        next(error);
    }
}

export const getComments = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const { count, rows: comments } = await Comment.findAndCountAll({ where: { postId }, order: [['createdAt', 'desc']] });
        res.status(200).json({ count, comments });
    } catch (error) {
        next(error);
    }
}

export const updateComment = async (req, res, next) => {
    const userId = req.body.userId;
    const id = req.params.commentId;
    const content = req.body.content
    if (req.user.id != userId) {
        return next(errorHandler(403, "Access denied"));
    }
    try {
        const existingComment = await Comment.findOne({ where: { id } });
        if (!existingComment) {
            throw errorHandler(404, 'comment not found');
        }
        await Comment.update({ content }, { where: { id } });
        res.status(200).json({ message: 'updated successfully' });
    } catch (error) {
        next(error);
    }
}