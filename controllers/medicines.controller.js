import { exceptionResponse } from "../exceptions/exceptionResponse.js";
import { MedicinesService } from "../services/medicine.service.js";

export const createMedicine = async (req, res) => {
    try {
        const medicine = await MedicinesService.createMedicine(req.body);
        return res.status(201).json(medicine); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const updateMedicine = async (req, res) => {
    try {
        const medicine = await MedicinesService.updateMedicine(req.body, req.params.medicineId);
        return res.status(200).json(medicine); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const deleteMedicine = async (req, res) => {
    try {
        const medicine = await MedicinesService.deleteMedicine(req.params.medicineId);
        return res.status(200).json(medicine); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const getMedicineByName = async (req, res) => {
    try {
        const medicine = await MedicinesService.getMedicineByName(req.params.medicineName);
        return res.status(200).json(medicine); 
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const getAllMedicines = async (req, res) => {
    try {
        const medicines = await MedicinesService.getAllMedicines();
        return res.status(200).json(medicines);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}