import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import Constants from '../constants/constants.js';


/**
 * @swagger
 * components:
 *  schemas:
 *      Species:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *         name:
 *          type: string
 *         species_id:
 *          type: integer
 *        required:
 *          - id
 *          - name
 *          - species_id
 *        example:
 *          id: 1
 *          name: Perro
 *          species_id: null
 */

class Species extends Model {
}

Species.init({
    name: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true
    }
}, {
    sequelize,
    modelName: 'Species',
    timestamps: false
});

export default Species;