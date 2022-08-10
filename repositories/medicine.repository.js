import { Op } from "sequelize";
import { Medicine } from "../models/Medicine.js";

export class MedicineRepository {
    static async getMedicineById(id){
        return await Medicine.findOne({
            where:{
                id
            }
        });
    }

    static async getMedicineByName(name){
        return await Medicine.findOne({
            where:{
                name
            }
        });
    }
}