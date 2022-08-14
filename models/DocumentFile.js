import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database/connectdb.js';
import { Constants } from '../constants/constants.js';

/**
 * @swagger
 * components:
 *  schemas:
 *      PatientDocumentFileResponse:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *         name:
 *          type: string
 *         link:
 *          type: string
 *         type:
 *          $ref: '#/components/schemas/DocumentFileTypeEnum'
 *         patientId:
 *          type: integer
 *         createdAt:
 *          type: datetime
 *        required:
 *          - id
 *          - name
 *          - link
 *          - type
 *          - patientId
 *          - createdAt
 *        example:
 *          id: 1
 *          name: Pepe_profile_image
 *          link: https://www.example.com/image.png
 *          type: IMAGE_PNG
 *          patientId: 1
 *          createdAt: 2019-03-17T00:00:00.000Z
 * 
 *      MedicalAttentionDocumentFileResponse:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *         name:
 *          type: string
 *         link:
 *          type: string
 *         type:
 *          $ref: '#/components/schemas/DocumentFileTypeEnum'
 *         medicalAttentionId:
 *          type: integer
 *         createdAt:
 *          type: datetime
 *        required:
 *          - id
 *          - name
 *          - link
 *          - type
 *          - medicalAttentionId
 *          - createdAt
 *        example:
 *          id: 1
 *          name: Pepe_profile_image
 *          link: https://www.example.com/image.png
 *          type: IMAGE_PNG
 *          medicalAttentionId: 1
 *          createdAt: 2019-03-17T00:00:00.000Z
 */

export class DocumentFile extends Model {
}

DocumentFile.init({
    name: {
        type: DataTypes.STRING(Constants.ONE_LINE_SIZE),
        allowNull: true,
        notEmpty: true
    },
    link: {
        type: DataTypes.STRING(Constants.LINK_SIZE),
        isUrl: true,
        allowNull: false,
        notEmpty: true
    },
    type: {
        type: DataTypes.ENUM,
        values: Constants.DOCUMENT_TYPES,
        allowNull: false,
        notEmpty: true
    }
}, {
    sequelize,
    modelName: 'documentFile',
    timestamps: true,
    updatedAt: false,
    underscored: true
});