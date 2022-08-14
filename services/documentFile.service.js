import { customException } from "../exceptions/exceptionResponse.js";
import { DocumentFile } from "../models/DocumentFile.js";
import { Patient } from "../models/Patient.js";
import { DocumentFileRepository } from "../repositories/documentFile.repository.js";

export class DocumentFileService {
    static async createPatientDocumentFile(body, patientId) {
        const patient = await Patient.findOne({ where: { id: patientId } });

        if (!patient)
            throw customException(404, "Patient not found");

        const { name, link, type } = body;
        const documentFileCreated = await DocumentFileRepository.getDocumentFileByNameAndPatientId(name, patientId);

        if (documentFileCreated)
            throw customException(400, "Document file already exists for this patient");
        
        let documentFile = DocumentFile.build({ name, link, type, patientId });
        await documentFile.save();

        return documentFile;
    }
}