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
//Pets
PetModel.belongsTo(UserModel, {onDelete:'CASCADE',foreignKey: 'userId'});
PetModel.hasMany(ReviewModel);
PetModel.hasMany(RequestModel);
//Requests
RequestModel.belongsTo(PetModel, {onDelete:'CASCADE',foreignKey: 'petId'});
RequestModel.belongsTo(UserModel, {onDelete:'CASCADE',foreignKey: 'userId'});
//Reviews
ReviewModel.belongsTo(PetModel, {onDelete:'CASCADE',foreignKey: 'petId'});
ReviewModel.belongsTo(UserModel, {onDelete:'CASCADE',foreignKey: 'userId'});