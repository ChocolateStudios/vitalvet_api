import sequelize, { Op } from "sequelize";
import { MedicalAttention } from "../models/MedicalAttention.js";
import { MedicalAttentionMedicine } from "../models/MedicalAttentionMedicine.js";
import { Medicine } from "../models/Medicine.js";

export class MedicalAttentionMedicineRepository {
    static async getMedicalAttentionMedicineByMedicalAttentionIdAndMedicineId(medicalAttentionId, medicineId){
        return await MedicalAttentionMedicine.findOne({
            where: {
                [Op.and]: [{ medicalAttentionId }, { medicineId }]
            }
        });
    }
    
    static async getAllMedicinesByMedicalAttentionId(medicalAttentionId){
        return await MedicalAttention.findOne({ 
            where: { id: medicalAttentionId },
            include: { 
                model: Medicine, 
                as: "medicines",
            },
            attributes: [ "id" ]
        });
    }
}