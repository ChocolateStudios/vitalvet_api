import { customException } from "../exceptions/exceptionResponse.js";
import { Species } from "../models/Species.js";
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

    static async createSubspecies(body, speciesId) {
        const { name } = body;

        const speciesCreated = await SpeciesRepository.getSpeciesById(speciesId);

        if (!speciesCreated)
            throw new customException(404, "Species not found");

        const subpeciesCreated = await SpeciesRepository.getSubspeciesByNameAndSpeciesId(name, speciesId);

        if (subpeciesCreated)
            throw new customException(400, "Subspecies already exists");

        const species = Species.build({ name, speciesId });
        await species.save();

        return species;
    }

    static async updateSpecies(body, id) {
        const { name } = body;

        const speciesCreated = await SpeciesRepository.getSpeciesByName(name);

        if (speciesCreated)
            throw new customException(400, "Another species already exists with this name");

        const species = await SpeciesRepository.getSpeciesById(id);

        if (!species)
            throw new customException(404, "Species not found");

        species.set({ name });
        await species.save();

        return species;
    }

    static async updateSubspecies(body, speciesId, id) {
        const { name } = body;

        const speciesCreated = await SpeciesRepository.getSpeciesById(speciesId);

        if (!speciesCreated)
            throw new customException(404, "Species not found");

        const subpeciesCreated = await SpeciesRepository.getSubspeciesByNameAndSpeciesId(name, speciesId);

        if (subpeciesCreated)
            throw new customException(400, "Another subspecies already exists with this name");

        const species = await SpeciesRepository.getSubspeciesByIdAndSpeciesId(id, speciesId);

        if (!species)
            throw new customException(404, "Subspecies not found");

        species.set({ name, speciesId });
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

    static async deleteSubspecies(speciesId, id) {
        const speciesCreated = await SpeciesRepository.getSpeciesById(speciesId);

        if (!speciesCreated)
            throw new customException(404, "Species not found");

        const species = await SpeciesRepository.getSubspeciesByIdAndSpeciesId(id, speciesId);

        if (!species)
            throw new customException(404, "Subspecies not found");

        await species.destroy();

        return species;
    }

    static async getAllSpecies() {
        const species = await SpeciesRepository.getAllSpeciesWithSubspecies();

        return species;
    }

    static async getAllSubspeciesBySpeciesId(speciesId) {
        const speciesCreated = await SpeciesRepository.getSpeciesById(speciesId);

        if (!speciesCreated)
            throw new customException(404, "Species not found");

        const species = await Species.findAll({ where: { speciesId } });

        return species;
    }
}