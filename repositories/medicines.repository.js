import { Op } from "sequelize";
import Medicines from "../models/Medicines.js";

export class MedicinesRepository {
    static async getMedicinesById(id){
        return await Medicines.findOne({
            where:{
                [Op.and]: [{ id }, { medicines_id: null }]
            }
        });
    }

    static async getMedicinesByName(name){
        return await Medicines.findOne({
            where:{
                [Op.and]: [{ name }, { medicines_id: null }]
            }
        });
    }
}