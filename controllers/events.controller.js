import { exceptionResponse } from "../exceptions/exceptionResponse.js";
import { EventService } from "../services/event.service.js";


export const createEvent = async (req, res) => {
    try {
        const event = await EventService.createEvent(req.body, req.uid);
        return res.status(201).json(event);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const event = await EventService.updateEvent(req.body, req.params.eventId);
        return res.status(200).json(event);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await EventService.deleteEvent(req.params.eventId);
        return res.status(200).json(event);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const event = await EventService.getEventById(req.params.eventId);
        return res.status(200).json(event);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const getAllEvents = async (req, res) => {
    try {
        const event = await EventService.getAllEvents();
        return res.status(200).json(event);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};