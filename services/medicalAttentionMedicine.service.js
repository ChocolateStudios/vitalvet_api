import { customException } from "../exceptions/exceptionResponse.js";
import { MedicalAttention } from "../models/MedicalAttention.js";
import { MedicalAttentionMedicine } from "../models/MedicalAttentionMedicine.js";
import { Medicine } from "../models/Medicine.js";
import { MedicalAttentionMedicineRepository } from "../repositories/medicalAttentionMedicine.repository.js";

export class MedicalAttentionMedicineService {
    static async createMedicalAttentionMedicine(body, medicalAttentionId, medicineId) {
        const medicalAttention = await MedicalAttention.findOne({ where: { id: medicalAttentionId } });

        if (!medicalAttention)
            throw customException(404, "Medical attention not found");

        const medicine = await Medicine.findOne({ where: { id: medicineId } });

        if (!medicine)
            throw customException(404, "Medicine not found");
            
        const { details } = body;

        const medicalAttentionMedicine = MedicalAttentionMedicine.build({ details, medicalAttentionId, medicineId });
        await medicalAttentionMedicine.save();

        return medicalAttentionMedicine;
    }

    static async updateMedicalAttentionMedicine(body, medicalAttentionId, medicineId) {
        const medicalAttention = await MedicalAttention.findOne({ where: { id: medicalAttentionId } });

        if (!medicalAttention)
            throw customException(404, "Medical attention not found");

        const medicine = await Medicine.findOne({ where: { id: medicineId } });

        if (!medicine)
            throw customException(404, "Medicine not found");

        const medicalAttentionMedicine = await MedicalAttentionMedicineRepository.getMedicalAttentionMedicineByMedicalAttentionIdAndMedicineId(medicalAttentionId, medicineId);

        if (!medicalAttentionMedicine)
            throw customException(404, "Medicine is not assigned with medical attention");
            
        const { details } = body;

        medicalAttentionMedicine.set({ details, medicalAttentionId, medicineId });
        await medicalAttentionMedicine.save();

        return medicalAttentionMedicine;
    }

    static async deleteMedicalAttentionMedicine(medicalAttentionId, medicineId) {
        const medicalAttention = await MedicalAttention.findOne({ where: { id: medicalAttentionId } });

        if (!medicalAttention)
            throw customException(404, "Medical attention not found");

        const medicine = await Medicine.findOne({ where: { id: medicineId } });

        if (!medicine)
            throw customException(404, "Medicine not found");

        const medicalAttentionMedicine = await MedicalAttentionMedicineRepository.getMedicalAttentionMedicineByMedicalAttentionIdAndMedicineId(medicalAttentionId, medicineId);

        if (!medicalAttentionMedicine)
            throw customException(404, "Medicine is not assigned with medical attention");

        await medicalAttentionMedicine.destroy();

        return medicalAttentionMedicine;
    }

    static async getAllMedicinesByMedicalAttentionId(medicalAttentionId) {
        const medicalAttention = await MedicalAttention.findOne({ where: { id: medicalAttentionId } });

        if (!medicalAttention)
            throw customException(404, "Medical attention not found");

        const medicines = await MedicalAttentionMedicineRepository.getAllMedicinesByMedicalAttentionId(medicalAttentionId);

        return medicines;
    }
}