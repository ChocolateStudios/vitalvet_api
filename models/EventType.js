import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import Constants from '../constants/constants.js';

/**
 * @swagger
 * components:
 *  schemas:
 *      EventType:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *         name:
 *          type: string
 *         type_color:
 *          type: string
 *        required:
 *          - id
 *          - name
 *          - type_color
 *        example:
 *          id: 1
 *          name: Corte Cabello
 *          type_color: "#008000"
 */

class EventType extends Model {
}

EventType.init({
    name: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true
    },
    type_color: {
        type: DataTypes.STRING(8),
        allowNull: false,
        notEmpty: true
    }
}, {
    sequelize,
    modelName: 'EventType',
    tableName: 'event_types',
    timestamps: false
});

export default EventType;

