import { Owner } from "../models/Owner.js";
import { Patient } from "../models/Patient.js";
import { Profile } from "../models/Profile.js";
import { Species } from "../models/Species.js";

export class PatientRepository {
    static async getPatientWithAttributesById(patientId) {
        return await Patient.findOne({
            where: { id: patientId },
            include: [
                {
                    model: Owner,
                    as: "owner",
                    attributes: ["id", "name", "lastname"]
                },
                {
                    model: Species,
                    as: "subspecies",
                    attributes: ["id", "name"],
                    include: {
                        model: Species,
                        as: "species",
                        attributes: ["id", "name"]
                    }
                },
                {
                    model: Profile,
                    as: "profile",
                    attributes: ["id", "name", "lastname"]
                }
            ],
            attributes: { exclude: ["ownerId", "subspeciesId", "profileId"] }
        });
    }
}