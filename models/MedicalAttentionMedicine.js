import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import { Constants } from '../constants/constants.js';
import { MedicalAttention } from './MedicalAttention.js';
import { Medicine } from './Medicine.js';

/**
 * @swagger
 * components:
 *  schemas:
 *      MedicalAttentionMedicineResponse:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *         details:
 *          type: string
 *         medicalAttentionId:
 *          type: integer
 *         medicineId:
 *          type: integer
 *        required:
 *          - id
 *          - details
 *          - medicalAttentionId
 *          - medicineId
 *        example:
 *          id: 1
 *          details: 3 veces al día, mañana, tarde y noche
 *          medicalAttentionId: 1
 *          medicineId: 1
 */

export class MedicalAttentionMedicine extends Model {
}

MedicalAttentionMedicine.init({
    details: {
        type: DataTypes.STRING(Constants.MULTILINE_SIZE),
        allowNull: false
    },
    medicalAttentionId: {
        type: DataTypes.INTEGER,
        references: {
            model: MedicalAttention,
            key: 'id'
        }
    },
    medicineId: {
        type: DataTypes.INTEGER,
        references: {
            model: Medicine,
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'medicalAttentionMedicine',
    timestamps: false,
    underscored: true
});