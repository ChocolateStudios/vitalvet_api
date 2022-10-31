import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import { Constants } from '../constants/constants.js';
import bcryptjs from 'bcryptjs';

export class User extends Model {
    async comparePassword(candidatePassword) {
        return await bcryptjs.compare(candidatePassword, this.password);
    }
 }

User.init({
    email: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        unique: true,
        isEmail: true,
        notEmpty: true
    },
    password: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true
    }
}, {
    sequelize,
    modelName: 'user',
    timestamps: false,
    underscored: true
});

User.beforeSave(async (user, options) => {

    if (!user.changed('password')) return;

    try {
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(user.password, salt);
    } catch (error) {
        console.log(error);
        throw new Error('Failed to generate password hash');
    }
});