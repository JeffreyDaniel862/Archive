import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";

const verifyUser = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return next(errorHandler(401, 'UnAuthorized'));
    jwt.verify(token, process.env.JWT_MAGIC, (err, user) => {
        if (err) {
            return next(errorHandler(403, "Forbidden, Access denied"));
        }
        req.user = user
        next()
    });
}

export default verifyUser;