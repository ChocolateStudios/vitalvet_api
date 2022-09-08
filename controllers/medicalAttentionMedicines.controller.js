import { exceptionResponse } from "../exceptions/exceptionResponse.js";
import { MedicalAttentionMedicineService } from "../services/medicalAttentionMedicine.service.js";

export const createMedicalAttentionMedicine = async (req, res) => {
    try {
        const medicalAttentionMedicine = await MedicalAttentionMedicineService.createMedicalAttentionMedicine(req.body, req.params.medicalAttentionId, req.params.medicineId);
        return res.status(201).json(medicalAttentionMedicine); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const updateMedicalAttentionMedicine = async (req, res) => {
    try {
        const medicalAttentionMedicine = await MedicalAttentionMedicineService.updateMedicalAttentionMedicine(req.body, req.params.medicalAttentionId, req.params.medicineId);
        return res.status(200).json(medicalAttentionMedicine); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const deleteMedicalAttentionMedicine = async (req, res) => {
    try {
        const medicalAttentionMedicine = await MedicalAttentionMedicineService.deleteMedicalAttentionMedicine(req.params.medicalAttentionId, req.params.medicineId);
        return res.status(200).json(medicalAttentionMedicine); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const getAllMedicinesByMedicalAttentionId = async (req, res) => {
    try {
        const medicalAttentionMedicines = await MedicalAttentionMedicineService.getAllMedicinesByMedicalAttentionId(req.params.medicalAttentionId);
        return res.status(200).json(medicalAttentionMedicines);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}