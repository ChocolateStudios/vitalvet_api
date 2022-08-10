import { Op } from "sequelize";
import { customException } from "../exceptions/exceptionResponse.js";
import { Medicine } from "../models/Medicine.js";
import { MedicineRepository } from "../repositories/medicine.repository.js";

export class MedicinesService {
    static async getAllMedicines() {
        const medicines = await Medicine.findAll();

        return medicines;
    }
    
    static async getMedicineByName(name) {
        const medicines = await MedicineRepository.getMedicineByName(name);

        if (!medicines)
            throw new customException(400, "Medicine not found");

        return medicines;
    }

    static async createMedicine(body) {
        const { name } = body;

        const medicinesCreated = await MedicineRepository.getMedicineByName(name);

        if (medicinesCreated)
            throw new customException(400, "Medicine already exists");

        const medicines = Medicine.build({ name });
        await medicines.save();

        return medicines;
    }

    static async updateMedicine(body, id) {
        const { name } = body;

        const medicinesCreated = await MedicineRepository.getMedicineByName(name);

        if (medicinesCreated)
            throw new customException(400, "Another medicine already exists with this name");

        const medicines = await MedicineRepository.getMedicineById(id);

        if (!medicines)
            throw new customException(404, "Medicine not found");

        medicines.set({ name });
        await medicines.save();

        return medicines;
    }

    static async deleteMedicine(id) {
        const medicines = await MedicineRepository.getMedicineById(id);

        if (!medicines)
            throw new customException(404, "Medicine not found");

        await medicines.destroy();

        return medicines;
    }

}