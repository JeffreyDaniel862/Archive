import { DataTypes } from "sequelize";
import { db } from "../config/database.js";
import Post from "./post.model.js";
import User from "./user.model.js";

const savedPost = db.define("savedPost", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,
            key: "id"
        }
    }
});

(async () => {
    await db.sync();
})();

User.hasMany(savedPost, { onDelete: 'cascade' });
Post.hasMany(savedPost, { onDelete: 'cascade' });

savedPost.belongsTo(User);
savedPost.belongsTo(Post);

export default savedPost;