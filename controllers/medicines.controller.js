import { exceptionResponse } from "../exceptions/exceptionResponse.js";
import { MedicinesService } from "../services/medicines.service.js";

export const getAllMedicines = async (req, res) => {
    try {
        const medicines = await MedicinesService.getAllMedicines();
        return res.status(200).json(medicines);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const getMedicinesByName = async (req, res) => {
    try {
        const medicines = await MedicinesService.getMedicinesByName(req.params.medicinesName);
        return res.status(200).json(medicines); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const createMedicines = async (req, res) => {
    try {
        const medicines = await MedicinesService.createMedicines(req.body);
        return res.status(201).json(medicines); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const updateMedicines = async (req, res) => {
    try {
        const medicines = await MedicinesService.updateMedicines(req.body, req.params.medicinesId);
        return res.status(201).json(medicines); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const deleteMedicines = async (req, res) => {
    try {
        const medicines = await MedicinesService.deleteMedicines(req.params.medicinesId);
        return res.status(201).json(medicines); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}
