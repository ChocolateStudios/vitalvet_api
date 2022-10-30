import { customException } from "../exceptions/exceptionResponse.js";
import { Owner } from "../models/Owner.js";
import { Patient } from "../models/Patient.js";
import { Profile } from "../models/Profile.js";
import { Species } from "../models/Species.js";
import { PatientRepository } from "../repositories/patient.repository.js";
import { SpeciesRepository } from "../repositories/species.repository.js";

export class PatientService {
    static async createPatient(body, userId) {
        const { name, weight, birthday, dayOfDeath, mainPicture, subspeciesId, ownerId } = body;

        const profile = await Profile.findOne({ where: { userId } });

        if (!profile)
            throw customException(404, "Profile not found for this user");

        const species = await SpeciesRepository.getSubspeciesById(subspeciesId);

        if (!species)
            throw customException(404, "Subspecies not found");

        const owner = await Owner.findOne({ where: { id: ownerId } });

        if (!owner)
            throw customException(404, "Owner not found");

        const patient = Patient.build({ 
            name, weight, birthday, dayOfDeath, mainPicture, subspeciesId, ownerId, profileId: profile.id });
            
        await patient.save();

        patient.dayOfDeath ? patient.dayOfDeath = patient.dayOfDeath : patient.dayOfDeath = null;
        patient.mainPicture ? patient.mainPicture = patient.mainPicture : patient.mainPicture = null;

        return patient;
    }
    
    static async updatePatient(body, id) {
        const patient = await Patient.findOne({ where: { id } });

        if (!patient)
            throw customException(404, "Patient not found");
            
        const { name, weight, birthday, dayOfDeath, mainPicture, subspeciesId, ownerId } = body;

        const species = await SpeciesRepository.getSubspeciesById(subspeciesId);

        if (!species)
            throw customException(404, "Subspecies not found");

        const owner = await Owner.findOne({ where: { id: ownerId } });

        if (!owner)
            throw customException(404, "Owner not found");

        patient.set({ name, weight, birthday, dayOfDeath, mainPicture, subspeciesId, ownerId });

        await patient.save();

        patient.dayOfDeath ? patient.dayOfDeath = patient.dayOfDeath : patient.dayOfDeath = null;
        patient.mainPicture ? patient.mainPicture = patient.mainPicture : patient.mainPicture = null;

        return patient;
    }
    
    static async deletePatient(id) {
        const patient = await Patient.findOne({ where: { id } });

        if (!patient)
            throw customException(404, "Patient not found");
            
        await patient.destroy();

        return patient;
    }
    
    static async getPatientById(id) {
        // const patient = await Patient.findOne({ where: { id } });
        const patient = await PatientRepository.getPatientWithAttributesById(id);

        if (!patient)
            throw customException(404, "Patient not found");

        return patient;
    }
    
    static async getAllPatients() {
        const patients = await Patient.findAll();

        return patients;
    }
}