import { OwnerService } from "../services/owner.service.js";

export const createOwner = async (req, res) => {
    try {
        const owner = await OwnerService.createOwner(req.body);
        return res.status(201).json(owner);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};