import { DataTypes } from 'sequelize';
import { db } from '../config/database.js';
import User from './user.model.js'
import Post from './post.model.js';

const Like = db.define('like', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,
            key: 'id'
        }
    }
});

User.hasMany(Like, { onDelete: 'cascade' });
Post.hasMany(Like, { onDelete: 'cascade' });

Like.belongsTo(User);
Like.belongsTo(Post);

export default Like;