import { Op } from "sequelize";
import { DocumentFile } from "../models/DocumentFile.js";

export class DocumentFileRepository {
    static async getDocumentFileByNameAndPatientId(name, patientId) {
        return await DocumentFile.findOne({
            where: {
                [Op.and]: [{ name }, { patientId }]
            }
        });
    }
    
    static async getDocumentFileByNameAndMedicalAttentionId(name, medicalAttentionId) {
        return await DocumentFile.findOne({
            where: {
                [Op.and]: [{ name }, { medicalAttentionId }]
            }
        });
    }
    
    static async getDocumentFileByPatientIdAndDocumentFileId(patientId, id) {
        return await DocumentFile.findOne({
            where: {
                [Op.and]: [{ patientId }, { id }]
            }
        });
    }
    
    static async getDocumentFileByMedicalAttentionIdAndDocumentFileId(medicalAttentionId, id) {
        return await DocumentFile.findOne({
            where: {
                [Op.and]: [{ medicalAttentionId }, { id }]
            }
        });
    }
}