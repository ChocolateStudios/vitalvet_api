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
}