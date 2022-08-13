import { customException } from "../exceptions/exceptionResponse.js";
import { MedicalAttention } from "../models/MedicalAttention.js";
import { Patient } from "../models/Patient.js";
import { Profile } from "../models/Profile.js";
import { MedicalAttentionRepository } from "../repositories/medicalAttention.repository.js";

export class MedicalAttentionService {
    static async createMedicalAttention(body){
        const { weight, description, date, resultNotes, patientId, profileId } = body;

        const profile = await Profile.findOne({ where: { profileId } });
        const patient = await Patient.findOne({ where: { patientId } });

        if (!profile)
            throw customException(404, "Profile does not exists");
        
        if (!patient)
            throw customException(404, "Patient does not exists");

        const medicalAttention = MedicalAttention.build({ weight, description, date, resultNotes, patientId, profileId });
        await medicalAttention.save();
        return medicalAttention;
    }

    static async updateMedicalAttention(body, id){
        const medicalAttention = await MedicalAttentionRepository.getMedicalAttentionById(id);

        if (!medicalAttention)
            throw customException(404, "Medical Attention does not exists");
        
        const { weight, description, date, resultNotes, patientId, profileId } = body;
        const profile = await Profile.findOne({ where: { profileId } });
        const patient = await Patient.findOne({ where: { patientId } });

        if (!profile)
            throw customException(404, "Profile does not exists");
        
        if (!patient)
            throw customException(404, "Patient does not exists");

        medicalAttention.set({ weight, description, date, resultNotes, patientId, profileId });
        await medicalAttention.save();
        return medicalAttention;
    }

    static async deleteMedicalAttention(id){
        const medicalAttention = await MedicalAttentionRepository.getMedicalAttentionById(id);

        if (!medicalAttention)
            throw customException(404, "Medical Attention does not exists");
        
        await medicalAttention.destroy();
        return medicalAttention;
    }

    static async getMedicalAttentionById(id){
        const medicalAttention = await MedicalAttentionRepository.getMedicalAttentionById(id);

        if (!medicalAttention)
            throw customException(404, "Medical Attention does not exists");
        
        return medicalAttention;
    }

    static async getMedicalAttentionsByPatientId(patientId){
        const medicalAttentions = await MedicalAttentionRepository.getMedicalAttentionsByPatientId(patientId);

        if (!medicalAttentions)
            throw customException(404, "The patient still does not have medical attention");
        
        return medicalAttentions;
    }

    static async getMedicalAttentionsByProfileId(profileId){
        const medicalAttentions = await MedicalAttentionRepository.getMedicalAttentionsByProfileId(profileId);

        if (!medicalAttentions)
            throw customException(404, "The profile still does not provide medical attention");
        
        return medicalAttentions;
    }

    static async getMedicalAttentionsByDate(date){
        const medicalAttentions = await MedicalAttentionRepository.getMedicalAttentionsByDate(date);

        if (!medicalAttentions)
            throw customException(404, `There are no medical attentions for the date of ${date}`);
        
        return medicalAttentions;        
    }

    static async getMedicalAttentionsBetweenDates(initialDate, finalDate){
        const medicalAttentions = await MedicalAttentionRepository.getMedicalAttentionsBetweenDates(initialDate, finalDate);

        if (!medicalAttentions)
            throw customException(404, `There are no medical attentions between the dates of ${initialDate} and ${finalDate}`);
        
        return medicalAttentions;
    }
}