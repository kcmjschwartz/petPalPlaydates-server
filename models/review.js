const { DataTypes } = require('sequelize');
const db = require("../db");

const Review = db.define("request", {
    date:{
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    rating: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
});

module.exports = Review;