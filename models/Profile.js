import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import Constants from '../constants/constants.js';

/**
 * @swagger
 * components:
 *  schemas:
 *      Profile:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *         name:
 *          type: string
 *         lastname:
 *          type: string
 *         birthday:
 *          type: date
 *         picture:
 *          type: string
 *         admin:
 *          type: boolean
 *         college:
 *          type: string
 *         review:
 *          type: string
 *         user:
 *          type: object
 *          $ref: '#/components/schemas/ProfileUser'
 *        required:
 *          - id
 *          - name
 *          - lastname
 *          - birthday
 *          - picture
 *          - admin
 *          - college
 *          - review
 *          - user
 *        example:
 *          id: 1
 *          name: Manuel
 *          lastname: Quispe
 *          birthday: 2020-01-01
 *          picture: http://www.example.com/image.png
 *          admin: false
 *          college: Universidad Nacional de Colombia
 *          review: Lorem ipsum dolor sit amet, consectetur
 *          user:
 *              id: 1
 *              email: hello@example.com
 */

class Profile extends Model {
}

Profile.init({
    name: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true
    },
    lastname: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true
    },
    birthday: {
        type: DataTypes.DATEONLY,
        isDate: true,
        allowNull: false,
        notEmpty: true
    },
    picture: {
        type: DataTypes.STRING(Constants.LINK_SIZE),
        isUrl: true,
        allowNull: true,
        notEmpty: true
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        notEmpty: true
    },
    college: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: false,
        notEmpty: true
    },
    review: {
        type: DataTypes.STRING(Constants.MULTILINE_SIZE),
        allowNull: false,
        notEmpty: true
    },
}, {
    sequelize,
    modelName: 'Profile',
    timestamps: false
});

export default Profile;