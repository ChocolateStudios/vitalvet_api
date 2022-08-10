import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import Constants from '../constants/constants.js';

/**
 * @swagger
 * components:
 *  schemas:
 *      Event:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *         title:
 *          type: string
 *         description:
 *          type: string
 *         startTime:
 *          type: datetime
 *         endTime:
 *          type: datetime
 *         patientId:
 *          type: integer
 *         profileId:
 *          type: integer
 *         eventTypeId:
 *          type: integer
 *        required:
 *          - id
 *          - title
 *          - description
 *          - startTime
 *          - patientId
 *          - profileId
 *          - eventTypeId
 *        example:
 *          id: 1
 *          title: Bañar a Pepe
 *          description: Shampoo de Limon
 *          startTime: 2019-03-17T00:00:00.000Z
 *          endTime: 2019-03-17T01:00:00.000Z
 *          patientId: 1
 *          profileId: 1
 *          eventTypeId: 1
 */

class Event extends Model {
}

Event.init({
    title: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true
    },
    description: {
        type: DataTypes.STRING(Constants.MULTILINE_SIZE),
        allowNull: false,
        notEmpty: true
    },
    start_time: {
        type: DataTypes.DATE(),
        allowNull: false,
        notEmpty: true
    },
    end_time: { 
        type: DataTypes.DATE(),
        allowNull: true,
        notEmpty: true
    },
}, {
    sequelize,
    modelName: 'Event',
    timestamps: false
});

export default Event;