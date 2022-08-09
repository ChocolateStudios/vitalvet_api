import { Op } from "sequelize";
import { customException } from "../exceptions/exceptionResponse.js";
import Species from "../models/Species.js";
import { SpeciesRepository } from "../repositories/species.repository.js";

export class SpeciesService {
    static async createSpecies(body) {
        const { name } = body;

        const speciesCreated = await SpeciesRepository.getSpeciesByName(name);

        if (speciesCreated)
            throw new customException(400, "Species already exists");

        const species = Species.build({ name });
        await species.save();

        return species;
    }

    static async createSubspecies(body, species_id) {
        const { name } = body;

        const speciesCreated = await SpeciesRepository.getSpeciesById(species_id);

        if (!speciesCreated)
            throw new customException(404, "Species not found");

        const subpeciesCreated = await SpeciesRepository.getSubspeciesByNameAndSpeciesId(name, species_id);

        if (subpeciesCreated)
            throw new customException(400, "Subspecies already exists");

        const species = Species.build({ name, species_id });
        await species.save();

        return species;
    }

    static async updateSpecies(body, id) {
        const { name } = body;

        const species = await SpeciesRepository.getSpeciesById(id);

        if (!species)
            throw new customException(404, "Species not found");

        species.set({ name });
        await species.save();

        return species;
    }

    static async updateSubspecies(body, species_id, id) {
        const { name } = body;

        const speciesCreated = await SpeciesRepository.getSpeciesById(species_id);

        if (!speciesCreated)
            throw new customException(404, "Species not found");

        const species = await SpeciesRepository.getSubspeciesByIdAndSpeciesId(id, species_id);

        if (!species)
            throw new customException(404, "Subspecies not found");

        species.set({ name, species_id });
        await species.save();

        return species;
    }

    static async deleteSpecies(id) {
        const species = await SpeciesRepository.getSpeciesById(id);

        if (!species)
            throw new customException(404, "Species not found");

        await species.destroy();

        return species;
    }

    static async deleteSubspecies(species_id, id) {
        const speciesCreated = await SpeciesRepository.getSpeciesById(species_id);

        if (!speciesCreated)
            throw new customException(404, "Species not found");

        const species = await SpeciesRepository.getSubspeciesByIdAndSpeciesId(id, species_id);

        if (!species)
            throw new customException(404, "Subspecies not found");

        await species.destroy();

        return species;
    }

    static async getAllSpecies() {
        const species = await Species.findAll({ where: { species_id: null } });

        return species;
    }

    static async getAllSubspeciesBySpeciesId(species_id) {
        const speciesCreated = await SpeciesRepository.getSpeciesById(species_id);

        if (!speciesCreated)
            throw new customException(404, "Species not found");

        const species = await Species.findAll({ where: { species_id } });

        return species;
    }
}