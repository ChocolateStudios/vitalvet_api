import { Op } from "sequelize";
import { Species } from "../models/Species.js";

export class SpeciesRepository {
    static async getSpeciesByName(name) {
        return await Species.findOne({
            where: {
                [Op.and]: [{ name }, { speciesId: null }]
            }
        });
    }

    static async getSpeciesById(id) {
        return await Species.findOne({ 
            where: {
                [Op.and]: [{ id }, { speciesId: null }]
            }
        });
    }

    static async getSubspeciesByNameAndSpeciesId(name, speciesId) {
        return await Species.findOne({
            where: {
                [Op.and]: [{ name }, { speciesId }]
            }
        });
    }

    static async getSubspeciesByIdAndSpeciesId(id, speciesId) {
        return await Species.findOne({ 
            where: {
                [Op.and]: [{ id }, { speciesId }]
            }
         });
    }

    static async getSubspeciesById(id) {
        return await Species.findOne({ 
            where: {
                [Op.and]: [
                    { id }, 
                    { speciesId: { [Op.not]: null } }
                ]
            }
         });
    }

    static async getAllSpeciesWithSubspecies() {
        return await Species.findAll({
            where: { speciesId: null },
            include: [{
                model: Species,
                as: "subspecies",
                attributes: ["id", "name"]
            }],
            attributes: { exclude: ["speciesId"] }
        });
    }
}