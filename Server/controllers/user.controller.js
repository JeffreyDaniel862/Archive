import { QueryTypes } from "sequelize";
import Follower from "../models/follower.model.js";
import savedPost from "../models/savedPost.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js"
import bcryptjs from 'bcryptjs';
import { db } from "../config/database.js";

export const updateUser = async (req, res, next) => {
    if (req.user.id != req.params.userID) {
        return next(errorHandler(401, "Unauthorized to update this account"));
    }

    if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = { ...req.body, ...(req.body.username && { username: req.body.username.replace(/\s+/g, '') }) }
    try {
        await User.update(updatedUser, { where: { id: req.params.userID } });
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
        const userInfo = await User.findOne({
            where: {
                ...(req.query.userId && { id: req.query.userId }),
                ...(req.query.username && { username: req.query.username })
            }
        })
        const user = { id: userInfo.id, username: userInfo.username, email: userInfo.email, displayPicture: userInfo.displayPictureURL }
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

export const followUser = async (req, res, next) => {
    if (req.user.id != req.params.userId) {
        return next(errorHandler(403, "Access denied"));
    }
    try {
        const alreadyFollowing = await Follower.findOne({
            where: {
                followerid: req.params.userId,
                followingid: req.body.followingId
            }
        });
        if (alreadyFollowing) {
            await Follower.destroy({ where: { id: alreadyFollowing.dataValues.id } });
        } else {
            await Follower.create({ followerid: req.params.userId, followingid: req.body.followingId });
        }
        return res.status(200).json({ message: "Success" });
    } catch (error) {
        next(error);
    }
}

export const getUserFollowers = async (req, res, next) => {
    let url = `SELECT followerid, "displayPictureURL", username 
             FROM followers AS f 
             INNER JOIN users AS u 
             ON f.followerid = u.id 
             WHERE  followingid=${req.params.userId}`
    if (req.query.limit) {
        url = `SELECT followerid, followingid, "displayPictureURL", username 
             FROM followers AS f 
             INNER JOIN users AS u 
             ON f.followerid = u.id 
             WHERE  followingid=${req.params.userId} LIMIT ${req.query.limit}`
    }
    try {
        const followers = await db.query(
            url,
            {
                type: QueryTypes.SELECT
            })
        res.status(200).json(followers);
    } catch (error) {
        next(error);
    }
}

export const getUserFollowing = async (req, res, next) => {
    let url = `
            SELECT followerid, followingid, "displayPictureURL", username
            FROM followers AS f
            INNER JOIN users as u
            ON f.followingid = u.id
            WHERE followerid=${req.params.userId}`

    if (req.query.limit) {
        url = `SELECT followerid, followingid, "displayPictureURL", username
            FROM followers AS f
            INNER JOIN users as u
            ON f.followingid = u.id
            WHERE followerid=${req.params.userId} LIMIT ${req.query.limit}`
    }

    try {
        const following = await db.query(url,
            {
                type: QueryTypes.SELECT
            });
        res.status(200).json(following);
    } catch (error) {
        next(error);
    }
}

export const getAnalytics = async (req, res, next) => {
    console.log(req.user.id, req.params.userId);
    if (req.user.id != req.params.userId) {
        return next(errorHandler(403, "Access denied"));
    }

    try {
        const userData = await db.query(`
            SELECT COUNT(DISTINCT p.id) AS postCount, COALESCE(SUM(v.views), 0) AS viewsCount,
            (SELECT COUNT(*) FROM followers flg WHERE flg.followerid = u.id) AS followingCount,
            (SELECT COUNT(*) FROM followers flwr WHERE flwr.followingid = u.id) AS followerCount,
            (SELECT COUNT(*) FROM posts p2 
            INNER JOIN "Views" v2 ON v2."postId" = p2.id
            WHERE p2."userId" = u.id 
            AND p2."createdAt" >= DATE_TRUNC('month', CURRENT_TIMESTAMP) - INTERVAL '1 month'
            AND p2."createdAt" < DATE_TRUNC('month', CURRENT_TIMESTAMP)
            ) AS lastMonthPostCount
            FROM users u
            LEFT JOIN posts AS p ON p."userId" = u.id
            LEFT JOIN "Views" AS v ON v."postId" = p.id
            WHERE u.id = ${req.params.userId}
            GROUP BY u.id`,
            {
                type: QueryTypes.SELECT
            }
        );
        res.status(200).json(userData);
    } catch (error) {
        next(error)
    }
}

export const getSavedPosts = async (req, res, next) => {
    if (req.user.id != req.params.userId) {
        return next(errorHandler(403, "Access denied"));
    }

    try {
        const savedPost = await db.query(`
            SELECT p.*, v.views FROM posts p
            INNER JOIN "Views" v
            ON v."postId" = p.id
            INNER JOIN "savedPosts" sp
            ON sp."postId" = p.id
            WHERE sp."userId" = ${req.params.userId}`,
            {
                type: QueryTypes.SELECT
            });
        res.status(200).json(savedPost)
    } catch (error) {
        console.error(error);
    }
}

export const getLikedPosts = async (req, res, next) => {
    if (req.user.id != req.params.userId) {
        return next(errorHandler(403, "Access denied"));
    }
    try {
        const likedPost = await db.query(`
            SELECT p.*, v.views FROM posts p
            INNER JOIN "Views" v
            ON v."postId" = p.id
            INNER JOIN "likes" l
            ON l."postId" = p.id
            WHERE l."userId" = ${req.params.userId}`,
            {
                type: QueryTypes.SELECT
            });
        res.status(200).json(likedPost)
    } catch (error) {
        console.error(error);
    }
}