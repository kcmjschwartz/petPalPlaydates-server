const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || `postgresql://postgres:${encodeURIComponent(process.env.PASS)}@localhost/petPals`,{
    dialect: 'postgres',
    ssl: process.env.ENVIRONMENT === 'production'
})

module.exports = sequelize;