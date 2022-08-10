import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import { Constants } from '../constants/constants.js';

/**
 * @swagger
 * components:
 *  schemas:
 *      EventTypeResponse:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *         name:
 *          type: string
 *         typeColor:
 *          type: string
 *        required:
 *          - id
 *          - name
 *          - typeColor
 *        example:
 *          id: 1
 *          name: Corte de cabello
 *          typeColor: "#008000"
 */

export class EventType extends Model {
}

EventType.init({
    name: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true,
        unique: true
    },
    typeColor: {
        type: DataTypes.STRING(8),
        allowNull: false,
        notEmpty: true
    }
}, {
    sequelize,
    modelName: 'eventType',
    timestamps: false,
    underscored: true
});

