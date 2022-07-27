import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import bcryptjs from 'bcryptjs';
import Constants from '../constants/constants.js';

class User extends Model {
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
    modelName: 'User',
    timestamps: false
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

export default User;