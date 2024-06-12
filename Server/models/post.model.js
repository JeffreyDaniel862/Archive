import { DataTypes } from "sequelize";
import { db } from "../config/database.js";
import User from "./user.model.js";

const Post = db.define('post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Uncategorized"
    },
    coverImage: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { tableName: 'posts', timestamps: true });

(async () => {
    await db.sync();
})();

User.hasMany(Post, { onDelete: 'cascade' });
Post.belongsTo(User, { foreignKey: { allowNull: false } });

export default Post;