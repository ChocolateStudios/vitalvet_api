import { customException } from "../exceptions/exceptionResponse.js";
import { MedicalAttention } from "../models/MedicalAttention.js";
import { Patient } from "../models/Patient.js";
import { Profile } from "../models/Profile.js";
import { MedicalAttentionRepository } from "../repositories/medicalAttention.repository.js";

export class MedicalAttentionService {
    static async createMedicalAttention(body, userId){
        const { weight, description, date, resultNotes, patientId } = body;

        const profile = await Profile.findOne({ where: { userId } });

        if (!profile)
            throw customException(404, "Profile not found for this user");

        const patient = await Patient.findOne({ where: { id: patientId } });
        
        if (!patient)
            throw customException(404, "Patient not found");

        const medicalAttention = MedicalAttention.build({ weight, description, date, resultNotes, patientId, profileId: profile.id });
        await medicalAttention.save();

        return medicalAttention;
    }

    static async updateMedicalAttention(body, id, userId){
        const medicalAttention = await MedicalAttentionRepository.getMedicalAttentionById(id);

        if (!medicalAttention)
            throw customException(404, "Medical attention not found");
        
        const { weight, description, date, resultNotes, patientId } = body;
        
        const profile = await Profile.findOne({ where: { userId } });

        if (!profile)
            throw customException(404, "Profile not found for this user");
            
        const patient = await Patient.findOne({ where: { id: patientId } });
        
        if (!patient)
            throw customException(404, "Patient not found");

        medicalAttention.set({ weight, description, date, resultNotes, patientId });
        await medicalAttention.save();

        return medicalAttention;
    }

    static async deleteMedicalAttention(id){
        const medicalAttention = await MedicalAttentionRepository.getMedicalAttentionById(id);

        if (!medicalAttention)
            throw customException(404, "Medical attention not found");
        
        await medicalAttention.destroy();

        return medicalAttention;
    }

    static async getMedicalAttentionById(id){
        const medicalAttention = await MedicalAttentionRepository.getMedicalAttentionById(id);

        if (!medicalAttention)
            throw customException(404, "Medical attention not found");
        
        return medicalAttention;
    }

    static async getAllMedicalAttentionsByPatientId(patientId){
        const patient = await Patient.findOne({ where: { id: patientId } });
        
        if (!patient)
            throw customException(404, "Patient not found");

        const medicalAttentions = await MedicalAttentionRepository.getMedicalAttentionsByPatientId(patientId);
        
        return medicalAttentions;
    }

    static async getAllMedicalAttentionsByProfileId(profileId){
        const profile = await Profile.findOne({ where: { id: profileId } });

        if (!profile)
            throw customException(404, "Profile not found");

        const medicalAttentions = await MedicalAttentionRepository.getMedicalAttentionsByProfileId(profileId);
        
        return medicalAttentions;
    }

    static async getAllMedicalAttentionsByDate(date){
        const medicalAttentions = await MedicalAttentionRepository.getMedicalAttentionsByDate(date);
        
        return medicalAttentions;        
    }

    static async getAllMedicalAttentionsBetweenDates(initialDate, finalDate){
        const medicalAttentions = await MedicalAttentionRepository.getMedicalAttentionsBetweenDates(initialDate, finalDate);
        
        return medicalAttentions;
    }
}