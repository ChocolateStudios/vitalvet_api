import { exceptionResponse } from "../exceptions/exceptionResponse.js";
import { EventTypeService } from "../services/eventType.service.js";

export const createEventType = async (req, res) => {
    try { 
        const eventType = await EventTypeService.createEventType(req.body);
        return res.status(201).json(eventType);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
}

export const updateEventType = async (req, res) => {
    try {
        const eventType = await EventTypeService.updateEventType(req.body, req.params.eventTypeId);
        return res.status(200).json(eventType);
    } catch(error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message});
    }
};

export const deleteEventType = async (req, res) => {
    try {
        const eventType = await EventTypeService.deleteEventType(req.params.eventTypeId);
        return res.status(200).json(eventType);
    } catch(error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

export const getAllEventTypes = async (req, res) => {
    try {
        const eventType = await EventTypeService.getAllEventTypes();
        return res.status(200).json(eventType);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

