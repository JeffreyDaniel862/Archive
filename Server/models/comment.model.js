import { DataTypes } from "sequelize";
import { db } from "../config/database.js";
import Post from "./post.model.js";
import User from "./user.model.js";

const Comment = db.define('comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, { tableName: 'comments', timestamps: true });

(async () => {
    await db.sync();
})();

Post.hasMany(Comment, { onDelete: 'cascade' });
User.hasMany(Comment, { onDelete: 'cascade' });

Comment.belongsTo(Post, { foreignKey: { allowNull: false } });
Comment.belongsTo(User, { foreignKey: { allowNull: false } });

export default Comment;