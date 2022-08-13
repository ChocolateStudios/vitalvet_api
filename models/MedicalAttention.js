import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import { Constants } from '../constants/constants.js';

/**
 * @swagger
 * components:
 *  schemas:
 *      MedicalAttention:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *         weight:
 *          type: number
 *         description:
 *          type: string
 *         date:
 *          type: date
 *         resultNotes:
 *          type: string
 *         patientId:
 *          type: integer
 *         profileId:
 *          type: integer
 *         createdAt:
 *          type: datetime
 *        required:
 *          - id
 *          - weight
 *          - description
 *          - date
 *          - resultNotes
 *          - patientId
 *          - profileId
 *          - createdAt
 *        example:
 *          id: 1
 *          weight: 25.5
 *          description: Tiene dolores en la cola
 *          date: 2022-03-17
 *          resultNotes: Lo pisaron muy fuerte, colocarle crema todos los dias
 *          patientId: 1
 *          profileId: 1
 *          createdAt: 2022-03-18T00:00:00.000Z
 */

export class MedicalAttention extends Model {
}

MedicalAttention.init({
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(Constants.MULTILINE_SIZE),
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    resultNotes: {
        type: DataTypes.STRING(Constants.MULTILINE_SIZE),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'medical_attention',
    timestamps: false,
    underscored: true
});