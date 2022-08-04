import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import Constants from '../constants/constants.js';
import constants from '../constants/constants.js';

/**
 * @swagger
 * components:
 *  schemas:
 *      EventTypes:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *         type_color:
 *          type: string
 *        required:
 *          - name
 *          - type_color
 *        example:
 *          name: Corte Cabello
 *          type_color: #008000
 */

class EventTypes extends Model {
 }

 Event.init({
    name:{
        type: DataTypes.STRING(constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true
    },
    type_color:{
        type: DataTypes.STRING(8),
        allowNull: false,
        notEmpty: true
    }
 }, {
    sequelize,
    modelName: 'Profile',
    timestamps: false
 });

 export default EventTypes;

