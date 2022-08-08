import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import Constants from '../constants/constants.js';

class Patient extends Model {
}

Patient.init({
    name: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    birthday: {
        type: DataTypes.DATEONLY,
        isDate: true,
        allowNull: false,
        notEmpty: true
    },
    day_of_death: {
        type: DataTypes.DATEONLY,
        isDate: true,
        allowNull: false,
        notEmpty: true
    },
    main_picture: {
        type: DataTypes.STRING(Constants.LINK_SIZE),
        isUrl: true,
        allowNull: true
    }

}, {
    sequelize,
    modelName: 'Patient',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default Patient;