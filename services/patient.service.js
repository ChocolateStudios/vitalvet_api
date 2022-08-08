import { customException } from "../exceptions/exceptionResponse.js";
import Patient from "../models/Patient.js";
import Profile from "../models/Profile.js";

export class PatientService {
    static async createPatient(body, user_id) {
        const profile = await Profile.findOne({ where: { user_id } });

        if (!profile)
            throw customException(404, "Profile not found for this user");

        const { name, weight, birthday, day_of_death, main_picture, species_id, owner_id } = body;

        const patient = Patient.build({ name, weight, birthday, day_of_death, main_picture, species_id, owner_id, profile_id: profile.id });
        await patient.save();

        return patient;
    }
}