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