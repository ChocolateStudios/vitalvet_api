import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import Constants from '../constants/constants.js';


/**
 * @swagger
 * components:
 *  schemas:
 *      Medicines:
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

class Medicines extends Model {
}

Medicines.init({
    name: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true
    }
}, {
    sequelize,
    modelName: 'Medicines',
    timestamps: false
});

export default Medicines;