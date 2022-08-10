import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import { Constants } from '../constants/constants.js';


/**
 * @swagger
 * components:
 *  schemas:
 *      MedicineResponse:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *         name:
 *          type: string
 *        required:
 *          - id
 *          - name
 *        example:
 *          id: 1
 *          name: Miralax
 */

export class Medicine extends Model {
}

Medicine.init({
    name: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true,
        unique: true
    }
}, {
    sequelize,
    modelName: 'medicine',
    timestamps: false,
    underscored: true
});