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
}