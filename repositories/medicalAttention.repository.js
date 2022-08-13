import sequelize, { Op } from "sequelize";
import { MedicalAttention } from "../models/MedicalAttention.js";

export class MedicalAttentionRepository {

    static async getMedicalAttentionById(id){
        return await MedicalAttention.findOne({
            where: {
                id
            }
        });
    }

    static async getMedicalAttentionsByPatientId(patientId){
        return await MedicalAttention.findAll({
            where: {
                patientId
            }
        });
    }

    static async getMedicalAttentionsByProfileId(profileId){
        return await MedicalAttention.findAll({
            where: {
                profileId
            }
        });
    }

    static async getMedicalAttentionsByDate(date){
        return await MedicalAttention.findAll({
            where: {
                date: Date.parse(date)
            }
        });
    }

    // no lo he probado, a ver que sale :)
    static async getMedicalAttentionsBetweenDates(initialDate, finalDate){
        return await sequelize.query(
            'SELECT * FROM medical_attention WHERE date BETWEEN :initialDate and :finalDate',
            {
                replacements: {
                    initialDate: Date.parse(initialDate),
                    finalDate: Date.parse(finalDate)
                },
                type: QueryTypes.SELECT,
                model: MedicalAttention,
                mapToModel:  true
            }
        );
    }
}