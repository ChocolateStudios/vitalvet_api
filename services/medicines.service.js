import { Op } from "sequelize";
import { customException } from "../exceptions/exceptionResponse.js";
import Medicines from "../models/Medicines.js";
import { MedicinesRepository } from "../repositories/medicines.repository.js";

export class MedicinesService {
    static async getAllMedicines() {
        const medicines = await Medicines.findAll({ where: { medicines_id: null } });

        return medicines;
    }

    static async createMedicines(body) {
        const { name } = body;

        const medicinesCreated = await MedicinesRepository.getMedicinesByName(name);

        if (medicinesCreated)
            throw new customException(400, "Medicines already exists");

        const medicines = Medicines.build({ name });
        await medicines.save();

        return medicines;
    }

    static async updateMedicines(body, id) {
        const { name } = body;

        const medicines = await MedicinesRepository.getMedicinesById(id);

        if (!medicines)
            throw new customException(404, "Medicines not found");

        medicines.set({ name });
        await medicines.save();

        return medicines;
    }

    static async deleteSpecies(id) {
        const medicines = await MedicinesRepository.getMedicinesById(id);

        if (!medicines)
            throw new customException(404, "Medicines not found");

        await medicines.destroy();

        return medicines;
    }

}