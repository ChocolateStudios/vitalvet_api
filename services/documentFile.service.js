import { customException } from "../exceptions/exceptionResponse.js";
import { DocumentFile } from "../models/DocumentFile.js";
import { MedicalAttention } from "../models/MedicalAttention.js";
import { Patient } from "../models/Patient.js";
import { DocumentFileRepository } from "../repositories/documentFile.repository.js";

export class DocumentFileService {
    static async createPatientDocumentFile(body, patientId) {
        const patient = await Patient.findOne({ where: { id: patientId } });

        if (!patient)
            throw customException(404, "Patient not found");

        const { name, link, type } = body;

        if (name) {
            const documentFileCreated = await DocumentFileRepository.getDocumentFileByNameAndPatientId(name, patientId);

            if (documentFileCreated)
                throw customException(400, "Document file already exists for this patient");
        }

        const documentFile = DocumentFile.build({ name, link, type, patientId });
        await documentFile.save();

        return {
            ...documentFile.dataValues,
            name: documentFile.name ? documentFile.name : null,
            medicalAttentionId: undefined
        };
    }

    static async createMedicalAttentionDocumentFile(body, medicalAttentionId) {
        const medicalAttention = await MedicalAttention.findOne({ where: { id: medicalAttentionId } });

        if (!medicalAttention)
            throw customException(404, "Medical attention not found");

        const { name, link, type } = body;

        if (name) {
            const documentFileCreated = await DocumentFileRepository.getDocumentFileByNameAndMedicalAttentionId(name, medicalAttentionId);

            if (documentFileCreated)
                throw customException(400, "Document file already exists for this medical attention");
        }

        const documentFile = DocumentFile.build({ name, link, type, medicalAttentionId });
        await documentFile.save();

        return {
            ...documentFile.dataValues,
            name: documentFile.name ? documentFile.name : null,
            patientId: undefined
        };
    }

    static async updatePatientDocumentFile(body, patientId, id) {
        const patient = await Patient.findOne({ where: { id: patientId } });

        if (!patient)
            throw customException(404, "Patient not found");

        const documentFile = await DocumentFileRepository.getDocumentFileByPatientIdAndDocumentFileId(patientId, id);

        if (!documentFile)
            throw customException(404, "Document file not found");

        const { name, link, type } = body;

        if (name) {
            const documentFileCreated = await DocumentFileRepository.getDocumentFileByNameAndPatientId(name, patientId);

            if (documentFileCreated)
                throw customException(400, "Document file already exists for this patient");
        }

        documentFile.set({ name, link, type, patientId });

        await documentFile.save();

        return {
            ...documentFile.dataValues,
            name: documentFile.name ? documentFile.name : null,
            medicalAttentionId: undefined
        };
    }

    static async updateMedicalAttentionDocumentFile(body, medicalAttentionId, id) {
        const medicalAttention = await MedicalAttention.findOne({ where: { id: medicalAttentionId } });

        if (!medicalAttention)
            throw customException(404, "Medical attention not found");

        const documentFile = await DocumentFileRepository.getDocumentFileByMedicalAttentionIdAndDocumentFileId(medicalAttentionId, id);

        if (!documentFile)
            throw customException(404, "Document file not found");

        const { name, link, type } = body;

        if (name) {
            const documentFileCreated = await DocumentFileRepository.getDocumentFileByNameAndMedicalAttentionId(name, medicalAttentionId);

            if (documentFileCreated)
                throw customException(400, "Document file already exists for this medical attention");
        }

        documentFile.set({ name, link, type, medicalAttentionId });

        await documentFile.save();

        return {
            ...documentFile.dataValues,
            name: documentFile.name ? documentFile.name : null,
            patientId: undefined
        };
    }

    static async deletePatientDocumentFile(patientId, id) {
        const patient = await Patient.findOne({ where: { id: patientId } });

        if (!patient)
            throw customException(404, "Patient not found");

        const documentFile = await DocumentFileRepository.getDocumentFileByPatientIdAndDocumentFileId(patientId, id);

        if (!documentFile)
            throw customException(404, "Document file not found");

        await documentFile.destroy();

        return {
            ...documentFile.dataValues,
            name: documentFile.name ? documentFile.name : null,
            medicalAttentionId: undefined
        };
    }

    static async deleteMedicalAttentionDocumentFile(medicalAttentionId, id) {
        const medicalAttention = await MedicalAttention.findOne({ where: { id: medicalAttentionId } });

        if (!medicalAttention)
            throw customException(404, "Medical attention not found");

        const documentFile = await DocumentFileRepository.getDocumentFileByMedicalAttentionIdAndDocumentFileId(medicalAttentionId, id);

        if (!documentFile)
            throw customException(404, "Document file not found");

        await documentFile.destroy();

        return {
            ...documentFile.dataValues,
            name: documentFile.name ? documentFile.name : null,
            patientId: undefined
        };
    }

    static async getPatientDocumentFileByPatientIdAndDocumentFileId(patientId, id) {
        const patient = await Patient.findOne({ where: { id: patientId } });

        if (!patient)
            throw customException(404, "Patient not found");

        const documentFile = await DocumentFileRepository.getDocumentFileByPatientIdAndDocumentFileId(patientId, id);

        if (!documentFile)
            throw customException(404, "Document file not found");

        return {
            ...documentFile.dataValues,
            name: documentFile.name ? documentFile.name : null,
            medicalAttentionId: undefined
        };
    }

    static async getMedicalAttentionDocumentFileByMedicalAttentionIdAndDocumentFileId(medicalAttentionId, id) {
        const medicalAttention = await MedicalAttention.findOne({ where: { id: medicalAttentionId } });

        if (!medicalAttention)
            throw customException(404, "Medical attention not found");

        const documentFile = await DocumentFileRepository.getDocumentFileByMedicalAttentionIdAndDocumentFileId(medicalAttentionId, id);

        if (!documentFile)
            throw customException(404, "Document file not found");

        return {
            ...documentFile.dataValues,
            name: documentFile.name ? documentFile.name : null,
            patientId: undefined
        };
    }

    static async getAllPatientDocumentFilesByPatientId(patientId) {
        const patient = await Patient.findOne({ where: { id: patientId } });

        if (!patient)
            throw customException(404, "Patient not found");

        const documentFiles = await DocumentFile.findAll({ where: { patientId } });

        return documentFiles;
    }

    static async getAllMedicalAttentionDocumentFilesByMedicalAttentionId(medicalAttentionId) {
        const medicalAttention = await MedicalAttention.findOne({ where: { id: medicalAttentionId } });

        if (!medicalAttention)
            throw customException(404, "Medical attention not found");

        const documentFiles = await DocumentFile.findAll({ where: { medicalAttentionId } });

        return documentFiles;
    }
}