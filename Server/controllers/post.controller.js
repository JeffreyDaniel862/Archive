import { Sequelize } from "sequelize";
import Post from "../models/post.model.js";
import { errorHandler } from "../utils/errorHandler.js"

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
        await Post.create(post);
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
            order: [['createdAt', sortDirection]]
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