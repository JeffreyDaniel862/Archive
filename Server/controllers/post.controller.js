import Post from "../models/post.model.js";
import { errorHandler } from "../utils/errorHandler.js"

export const createPost = async (req, res, next) => {
    if(req.user.id != req.params.id){
        next(errorHandler(403, "Access denied"));
    }
    if(!req.body.title || !req.body.content){
        next(errorHandler(400, "Please fill all necessary fields to publish a blog."));
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');
    const post = {...req.body, slug, userId: req.user.id}
    try {
        await Post.create(post);
        res.status(201).json({message: 'post created successfully'});
    } catch (error) {
        next(error)
    }
}