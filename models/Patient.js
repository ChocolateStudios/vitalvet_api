import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import Constants from '../constants/constants.js';

/**
 * @swagger
 * components:
 *  schemas:
 *      Patient:
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
 *         createdAt:
 *          type: datetime
 *         speciesId:
 *          type: integer
 *         ownerId:
 *          type: integer
 *         profileId:
 *          type: integer
 *        required:
 *          - id
 *          - name
 *          - weight
 *          - birthday
 *          - dayOfDeath
 *          - mainPicture
 *          - createdAt
 *          - speciesId
 *          - ownerId
 *          - profileId
 *        example:
 *          id: 1
 *          name: Pepe
 *          weight: 40
 *          birthday: 2019-03-17
 *          dayOfDeath: 2021-06-24
 *          mainPicture: https://www.example.com/image.png
 *          createdAt: 2019-03-17T00:00:00.000Z
 *          speciesId: 1
 *          ownerId: 1
 *          profileId: 1
 */

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
        allowNull: true,
        notEmpty: true
    },
    main_picture: {
        type: DataTypes.STRING(Constants.LINK_SIZE),
        isUrl: true,
        allowNull: true,
        notEmpty: true
    }

}, {
    sequelize,
    modelName: 'Patient',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default Patient;