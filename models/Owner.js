import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import { Constants } from '../constants/constants.js';

/**
 * @swagger
 * components:
 *  schemas:
 *      OwnerResponse:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *         name:
 *          type: string
 *         lastname:
 *          type: string
 *         birthday:
 *          type: date
 *         direction:
 *          type: string
 *         phone:
 *          type: string
 *         dni:
 *          type: string
 *         email:
 *          type: string
 *        required:
 *          - id
 *          - name
 *          - lastname
 *          - birthday
 *          - direction
 *          - phone
 *          - dni
 *          - email
 *        example:
 *          id: 1
 *          name: Hugo
 *          lastname: Parker
 *          birthday: 2020-01-01
 *          direction: Av. Example 123 - Bogota
 *          phone: 999544555
 *          dni: 760987654
 *          email: hugo@example.com
 */

export class Owner extends Model {
}

Owner.init({
    name: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true
    },
    lastname: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true
    },
    birthday: {
        type: DataTypes.DATEONLY,
        isDate: true,
        allowNull: false,
        notEmpty: true
    },
    direction: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        notEmpty: true,
    },
    dni: {
        type: DataTypes.STRING(15),
        allowNull: true,
        notEmpty: true,
        isNumeric: true
    },
    email: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: true,
        notEmpty: true,
        isEmail: true
    }
}, {
    sequelize,
    modelName: 'owner',
    timestamps: false,
    underscored: true
});