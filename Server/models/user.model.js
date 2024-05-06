import { DataTypes } from 'sequelize';
import { db } from '../config/database.js';

const User = db.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    displayPictureURL: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {tableName: 'users', timestamps: true});

(async () => {
    await db.sync();
})();

export default User;