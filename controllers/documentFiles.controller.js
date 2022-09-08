import { exceptionResponse } from '../exceptions/exceptionResponse.js';
import { DocumentFileService } from '../services/documentFile.service.js';

export const createPatientDocumentFile = async (req, res) => {
    try {
        const documentFile = await DocumentFileService.createPatientDocumentFile(req.body, req.params.patientId);
        return res.status(201).json(documentFile);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const createMedicalAttentionDocumentFile = async (req, res) => {
    try {
        const documentFile = await DocumentFileService.createMedicalAttentionDocumentFile(req.body, req.params.medicalAttentionId);
        return res.status(201).json(documentFile);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const updatePatientDocumentFile = async (req, res) => {
    try {
        const documentFile = await DocumentFileService.updatePatientDocumentFile(req.body, req.params.patientId, req.params.documentFileId);
        return res.status(200).json(documentFile);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const updateMedicalAttentionDocumentFile = async (req, res) => {
    try {
        const documentFile = await DocumentFileService.updateMedicalAttentionDocumentFile(req.body, req.params.medicalAttentionId, req.params.documentFileId);
        return res.status(200).json(documentFile);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const deletePatientDocumentFile = async (req, res) => {
    try {
        const documentFile = await DocumentFileService.deletePatientDocumentFile(req.params.patientId, req.params.documentFileId);
        return res.status(200).json(documentFile);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const deleteMedicalAttentionDocumentFile = async (req, res) => {
    try {
        const documentFile = await DocumentFileService.deleteMedicalAttentionDocumentFile(req.params.medicalAttentionId, req.params.documentFileId);
        return res.status(200).json(documentFile);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const getPatientDocumentFileByPatientIdAndDocumentFileId = async (req, res) => {
    try {
        const documentFile = await DocumentFileService.getPatientDocumentFileByPatientIdAndDocumentFileId(req.params.patientId, req.params.documentFileId);
        return res.status(200).json(documentFile);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const getMedicalAttentionDocumentFileByMedicalAttentionIdAndDocumentFileId = async (req, res) => {
    try {
        const documentFile = await DocumentFileService.getMedicalAttentionDocumentFileByMedicalAttentionIdAndDocumentFileId(req.params.medicalAttentionId, req.params.documentFileId);
        return res.status(200).json(documentFile);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const getAllPatientDocumentFilesByPatientId = async (req, res) => {
    try {
        const documentFiles = await DocumentFileService.getAllPatientDocumentFilesByPatientId(req.params.patientId);
        return res.status(200).json(documentFiles);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const getAllMedicalAttentionDocumentFilesByMedicalAttentionId = async (req, res) => {
    try {
        const documentFiles = await DocumentFileService.getAllMedicalAttentionDocumentFilesByMedicalAttentionId(req.params.medicalAttentionId);
        return res.status(200).json(documentFiles);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};