import { Sequelize, DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';

class User extends Model { }

User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User',
    timestamps: false
});