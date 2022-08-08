import { customException, exceptionResponse } from '../exceptions/exceptionResponse.js';
import Profile from '../models/Profile.js';
import { ProfileService } from '../services/profile.service.js';

export const createProfile = async (req, res) => {
    try {
        const profile = await ProfileService.createProfile(req.body, req.uid);
        return res.status(201).json(profile);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const profile = await ProfileService.updateProfile(req.body, req.uid);
        return res.status(200).json(profile);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const profile = await ProfileService.deleteProfile(req.uid);
        return res.status(200).json(profile);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const profile = await ProfileService.getProfile(req.uid);
        return res.status(200).json(profile);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const getAllProfilesIfAdmin = async (req, res) => {
    try {
        const profiles = await ProfileService.getAllProfilesIfAdmin(req.uid);
        return res.status(200).json(profiles);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};