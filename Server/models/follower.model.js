import { DataTypes } from "sequelize";
import { db } from "../config/database.js";
import User from "./user.model.js";

const Follower = db.define("follower", {
    followerid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        },
        onDelete: "CASCADE"
    },
    followingid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        },
        onDelete: "CASCADE"
    }
}, { tableName: "followers" });

(async () => {
    await db.sync();
})();

export default Follower;