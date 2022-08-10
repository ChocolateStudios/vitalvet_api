import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import { Constants } from '../constants/constants.js';

/**
 * @swagger
 * components:
 *  schemas:
 *      PatientResponse:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *         name:
 *          type: string
 *         weight:
 *          type: number
 *         birthday:
 *          type: date
 *         dayOfDeath:
 *          type: date
 *         mainPicture:
 *          type: string
 *         subspeciesId:
 *          type: integer
 *         ownerId:
 *          type: integer
 *         profileId:
 *          type: integer
 *         createdAt:
 *          type: datetime
 *        required:
 *          - id
 *          - name
 *          - weight
 *          - birthday
 *          - dayOfDeath
 *          - mainPicture
 *          - subspeciesId
 *          - ownerId
 *          - profileId
 *          - createdAt
 *        example:
 *          id: 1
 *          name: Pepe
 *          weight: 40
 *          birthday: 2019-03-17
 *          dayOfDeath: 2021-06-24
 *          mainPicture: https://www.example.com/image.png
 *          subspeciesId: 1
 *          ownerId: 1
 *          profileId: 1
 *          createdAt: 2019-03-17T00:00:00.000Z
 */

export class Patient extends Model {
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
    dayOfDeath: {
        type: DataTypes.DATEONLY,
        isDate: true,
        allowNull: true,
        notEmpty: true
    },
    mainPicture: {
        type: DataTypes.STRING(Constants.LINK_SIZE),
        isUrl: true,
        allowNull: true,
        notEmpty: true
    }

}, {
    sequelize,
    modelName: 'patient',
    timestamps: true,
    updatedAt: false,
    underscored: true
});