const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:T@pD@nc3r@localhost:5432/petPals");

module.exports = sequelize;