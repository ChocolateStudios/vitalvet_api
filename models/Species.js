import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import { Constants } from '../constants/constants.js';


/**
 * @swagger
 * components:
 *  schemas:
 *      SpeciesResponse:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *         name:
 *          type: string
 *         speciesId:
 *          type: integer
 *        required:
 *          - id
 *          - name
 *          - speciesId
 *        example:
 *          id: 1
 *          name: Perro
 *          speciesId: null
 */

export class Species extends Model {
}

Species.init({
    name: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true
    }
}, {
    sequelize,
    modelName: 'species',
    timestamps: false,
    underscored: true
});