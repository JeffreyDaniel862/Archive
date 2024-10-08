import { QueryTypes, Sequelize } from "sequelize";
import Post from "../models/post.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import Like from '../models/like.model.js';
import savedPost from "../models/savedPost.model.js";
import Views from "../models/views.model.js";
import { db } from "../config/database.js";

export const createPost = async (req, res, next) => {
    if (req.user.id != req.params.id) {
        next(errorHandler(403, "Access denied"));
    }
    if (!req.body.title || !req.body.content) {
        next(errorHandler(400, "Please fill all necessary fields to publish a blog."));
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');
    const post = { ...req.body, slug, userId: req.user.id }
    try {
        const createdPost = await Post.create(post);
        await Views.create({ postId: createdPost.dataValues.id })
        res.status(201).json({ message: 'post created successfully' });
    } catch (error) {
        next(error)
    }
}

export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? "ASC" : "DESC";
        const { count, rows: posts } = await Post.findAndCountAll({
            where: {
                ...(req.query.userId && { userId: req.query.userId }),
                ...(req.query.category && { category: req.query.category }),
                ...(req.query.slug && { slug: req.query.slug }),
                ...(req.query.id && { id: req.query.id }),
                ...(req.query.searchTerm && {
                    [Sequelize.Op.or]: [
                        { title: { [Sequelize.Op.iRegexp]: req.query.searchTerm } },
                        { content: { [Sequelize.Op.iRegexp]: req.query.searchTerm } },
                    ],
                }),
            },
            offset: startIndex,
            limit,
            order: [['createdAt', sortDirection]],
            include: [
                {
                    model: Views,
                    attributes: ['views']
                }
            ]
        });
        const now = new Date();
        const aMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const totalPosts = await Post.count({
            where: {
                ...(req.params.userId && { userId: req.params.userId })
            }
        });
        const lastMonthPosts = await Post.count({
            where: {
                ...(req.params.userId && { userId: req.params.userId }),
                createdAt: {
                    [Sequelize.Op.gt]: aMonthAgo
                },
            },
        });

        res.status(200).json({ posts, totalPosts, lastMonthPosts, count });

    } catch (error) {
        next(error)
    }
}

export const updatePost = async (req, res, next) => {
    if (req.user.id != req.params.userId) {
        next(errorHandler(403, 'Access denied'));
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');
    const updateInfo = {
        title: req.body.title,
        coverImage: req.body.coverImage,
        content: req.body.content,
        category: req.body.category,
        slug,
        userId: req.body.userId
    }
    try {
        await Post.update(updateInfo, { where: { id: req.body.id } });
        res.status(200).json({ message: "successfully updated" });
    } catch (error) {
        next(error);
    }
}

export const deletePost = async (req, res, next) => {
    if (req.user.id != req.params.userId) {
        next(errorHandler(403, 'Access denied'))
    }

    try {
        await Post.destroy({ where: { id: req.params.postId } });
        res.status(200).json({ message: "success" });
    } catch (error) {
        next(error)
    }
}

export const likePost = async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.body.userId;
    if (req.user.id != userId) {
        next(errorHandler(403, 'Access denied'));
    }
    try {
        const alreadyLiked = await Like.findOne({ where: { postId, userId } });
        if (alreadyLiked) {
            await Like.destroy({ where: { id: alreadyLiked.dataValues.id } })
        } else {
            await Like.create({ postId, userId });
        }
        res.status(200).json({ message: 'success' });
    } catch (error) {
        next(error);
    }
}

export const likesOfPost = async (req, res, next) => {
    try {
        const { count, rows: likedUsers } = await Like.findAndCountAll({ where: { postId: req.params.postId } });
        res.status(200).json({ count, likedUsers });
    } catch (error) {
        next(error);
    }
}

export const savePost = async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.body.userId;
    if (req.user.id != userId) {
        next(errorHandler(403, 'Access denied'));
    }
    try {
        const alreadySaved = await savedPost.findOne({ where: { postId, userId } });
        if (alreadySaved) {
            await savedPost.destroy({ where: { id: alreadySaved.dataValues.id } });
        } else {
            await savedPost.create({ postId, userId });
        }
        res.status(200).json({ message: 'success' });
    } catch (error) {
        next(error);
    }
}

export const addViews = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const existingViews = await Views.findOne({ where: { postId } });
        if (!existingViews) {
            await Views.create({ postId });
            return res.status(200).json({ message: "views updated" });
        }
        await Views.update({ views: existingViews.dataValues.views + 1 }, { where: { id: existingViews.dataValues.id } });
        res.status(200).json({ message: "views updated" });
    } catch (error) {
        next(error);
    }
}

export const getPersonalizedFeed = async (req, res, next) => {
    // fetch feeds from author the user follows order by desc in column createdAt if the authors don't have any feeds show some post in random.
    try {
        const feeds = await db.query(`
            SELECT p.*, v.views FROM posts p
            INNER JOIN followers f
            ON f.followingid = p."userId"
            INNER JOIN "Views" v
            ON v."postId" = p.id
            WHERE followerid = ${req.params.userId}`,
            {
                type: QueryTypes.SELECT
            });
        if (feeds.length > 0) {
            return res.status(200).json(feeds);
        }
        const randomFeeds = await db.query(`
            SELECT p.*, v.views FROM posts p 
            LEFT JOIN "Views" v
            ON v."postId" = p.id
            ORDER BY "createdAt" DESC LIMIT 9`,
            {
                type: QueryTypes.SELECT
            });
        console.log("random");
        res.status(200).json(randomFeeds);
    } catch (error) {
        next(error);
    }
}