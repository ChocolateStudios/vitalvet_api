import { customException } from "../exceptions/exceptionResponse.js";
import { Owner } from "../models/Owner.js";

export class OwnerService {
    static async createOwner(body) {
        const { name, lastname, birthday, direction, phone, dni, email } = body;

        const owner = Owner.build({ name, lastname, birthday, direction, phone, dni, email });
        await owner.save();
        
        owner.dni ? owner.dni = owner.dni : owner.dni = null;
        owner.email ? owner.email = owner.email : owner.email = null;

        return owner;
    }
    
    static async updateOwner(body, id) {
        const owner = await Owner.findOne({ where: { id } });

        if (!owner)
            throw new customException(404, "Owner not found");
            
        const { name, lastname, birthday, direction, phone, dni, email } = body;

        owner.set({ name, lastname, birthday, direction, phone, dni, email });
        await owner.save();

        return owner;
    }
    
    static async deleteOwner(id) {
        const owner = await Owner.findOne({ where: { id } });

        if (!owner)
            throw new customException(404, "Owner not found");
            
        await owner.destroy();

        return owner;
    }
    
    static async getOwnerById(id) {
        const owner = await Owner.findOne({ where: { id } });

        if (!owner)
            throw new customException(404, "Owner not found");
            
        return owner;
    }
    
    static async getAllOwners() {
        const owners = await Owner.findAll();

        return owners;
    }
}