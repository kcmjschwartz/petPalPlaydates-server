const db = require('../db');

const UserModel = require('./user');
const PetModel = require('./pet');
const RequestModel = require('./request');
const ReviewModel = require('./review')


module.exports = {
    dbConnection: db,
    UserModel,
    PetModel,
    RequestModel,
    ReviewModel
};

UserModel.hasMany(PetModel);
UserModel.hasMany(RequestModel);
UserModel.hasMany(ReviewModel);

PetModel.belongsTo(UserModel);
PetModel.hasMany(ReviewModel);
PetModel.hasMany(RequestModel);

RequestModel.belongsTo(PetModel);
RequestModel.belongsTo(UserModel);

ReviewModel.belongsTo(PetModel);
ReviewModel.belongsTo(UserModel);