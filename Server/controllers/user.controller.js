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