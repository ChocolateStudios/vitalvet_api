import { exceptionResponse } from "../exceptions/exceptionResponse.js";
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

export const updateOwner = async (req, res) => {
    try {
        const owner = await OwnerService.updateOwner(req.body, req.params.ownerId);
        return res.status(200).json(owner);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const deleteOwner = async (req, res) => {
    try {
        const owner = await OwnerService.deleteOwner(req.params.ownerId);
        return res.status(200).json(owner);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const getOwnerById = async (req, res) => {
    try {
        const owner = await OwnerService.getOwnerById(req.params.ownerId);
        return res.status(200).json(owner);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const getAllOwners = async (req, res) => {
    try {
        const owners = await OwnerService.getAllOwners();
        return res.status(200).json(owners);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};