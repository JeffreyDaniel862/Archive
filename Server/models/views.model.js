import { DataTypes } from 'sequelize'
import { db } from '../config/database.js'
import Post from './post.model.js'

const Views = db.define("Views", {
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,
            key: "id"
        }
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
});

(async () => {
    await db.sync();
})();

Post.hasOne(Views, { onDelete: "cascade" });
Views.belongsTo(Post);

export default Views;