const { DataTypes } = require('sequelize');
const db = require("../db");

const Pet = db.define("pet", {
    petName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    petType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
});

module.exports = Pet;