import { Op } from "sequelize";
import Medicines from "../models/Medicines.js";

export class MedicinesRepository {
    static async getMedicinesById(id){
        return await Medicines.findOne({
            where:{
                id: [{ id }]
            }
        });
    }

    static async getMedicinesByName(name){
        return await Medicines.findOne({
            where:{
                name: [{ name }]
            }
        });
    }
}