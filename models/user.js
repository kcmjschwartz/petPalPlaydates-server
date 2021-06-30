const {DataTypes} = require("sequelize");
const db = require('../db');

const User= db.define('user',{
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    admin:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
});

module.exports = User;
