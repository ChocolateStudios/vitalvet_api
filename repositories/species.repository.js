import { Op } from "sequelize";
import { Species } from "../models/Species.js";

export class SpeciesRepository {
    static async getSpeciesByName(name) {
        return await Species.findOne({
            where: {
                [Op.and]: [{ name }, { species_id: null }]
            }
        });
    }

    static async getSpeciesById(id) {
        return await Species.findOne({ 
            where: {
                [Op.and]: [{ id }, { species_id: null }]
            }
        });
    }

    static async getSubspeciesByNameAndSpeciesId(name, species_id) {
        return await Species.findOne({
            where: {
                [Op.and]: [{ name }, { species_id }]
            }
        });
    }

    static async getSubspeciesByIdAndSpeciesId(id, species_id) {
        return await Species.findOne({ 
            where: {
                [Op.and]: [{ id }, { species_id }]
            }
         });
    }

    static async getSubspeciesById(id) {
        return await Species.findOne({ 
            where: {
                [Op.and]: [
                    { id }, 
                    { species_id: { [Op.not]: null } }
                ]
            }
         });
    }

    static async getAllSpeciesWithSubspecies() {
        return await Species.findAll({
            where: { species_id: null },
            include: [{
                model: Species,
                as: "subspecies",
                attributes: ["id", "name"]
            }],
            attributes: { exclude: ["species_id"] }
        });
    }
}