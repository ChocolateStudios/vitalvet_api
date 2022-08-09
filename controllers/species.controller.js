import { exceptionResponse } from "../exceptions/exceptionResponse.js";
import { SpeciesService } from "../services/species.service.js";

export const createSpecies = async (req, res) => {
    try {
        const species = await SpeciesService.createSpecies(req.body);
        return res.status(201).json(species);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const createSubspecies = async (req, res) => {
    try {
        const species = await SpeciesService.createSubspecies(req.body, req.params.speciesId);
        return res.status(201).json(species);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const updateSpecies = async (req, res) => {
    try {
        const species = await SpeciesService.updateSpecies(req.body, req.params.speciesId);
        return res.status(200).json(species);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const updateSubspecies = async (req, res) => {
    try {
        const species = await SpeciesService.updateSubspecies(req.body, req.params.speciesId, req.params.subspeciesId);
        return res.status(200).json(species);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const deleteSpecies = async (req, res) => {
    try {
        const species = await SpeciesService.deleteSpecies(req.params.speciesId);
        return res.status(200).json(species);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const deleteSubspecies = async (req, res) => {
    try {
        const species = await SpeciesService.deleteSubspecies(req.params.speciesId, req.params.subspeciesId);
        return res.status(200).json(species);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const getAllSpecies = async (req, res) => {
    try {
        const species = await SpeciesService.getAllSpecies();
        return res.status(200).json(species);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const getAllSubspeciesBySpeciesId = async (req, res) => {
    try {
        const species = await SpeciesService.getAllSubspeciesBySpeciesId(req.params.speciesId);
        return res.status(200).json(species);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};