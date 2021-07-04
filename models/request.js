const { DataTypes } = require('sequelize');
const db = require("../db");

const Request = db.define("request", {
    status:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    wayToContact: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
});

module.exports = Request;