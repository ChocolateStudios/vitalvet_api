import { exceptionResponse } from "../exceptions/exceptionResponse.js";
import { MedicalAttentionService } from "../services/medicalAttention.service.js";

export const createMedicalAttention = async (req, res) => {
    try {
        const medicalAttention = await MedicalAttentionService.createMedicalAttention(req.body, req.uid);
        return res.status(201).json(medicalAttention); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const updateMedicalAttention = async (req, res) => {
    try {
        const medicalAttention = await MedicalAttentionService.updateMedicalAttention(req.body, req.params.medicalAttentionId, req.uid);
        return res.status(200).json(medicalAttention); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const deleteMedicalAttention = async (req, res) => {
    try {
        const medicalAttention = await MedicalAttentionService.deleteMedicalAttention(req.params.medicalAttentionId);
        return res.status(200).json(medicalAttention); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const getMedicalAttentionById = async (req, res) => {
    try {
        const medicalAttention = await MedicalAttentionService.getMedicalAttentionById(req.params.medicalAttentionId);
        return res.status(200).json(medicalAttention); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const getAllMedicalAttentionsByPatientId = async (req, res) => {
    try {
        const medicalAttentions = await MedicalAttentionService.getAllMedicalAttentionsByPatientId(req.params.patientId);
        return res.status(200).json(medicalAttentions);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}