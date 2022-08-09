import { customException } from "../exceptions/exceptionResponse.js";
import EventType from "../models/EventType.js";

export class EventTypeService {
    static async createEventType(body) {

        const { name, type_color } = body;

        const eventTypeCreated = await EventType.findOne({ where: { name } });
        
        if (eventTypeCreated)
            throw new customException(400, "Event type already exists");

        const eventType = EventType.build({ name, type_color });
        await eventType.save();

        return eventType;

    }

    static async updateEventType(body, id) {
        const { name, type_color } = body;

        const eventType = await EventType.findOne({ where: { id } });
        
        if (!eventType)
            throw new customException(404, "Event Type not found");
        
        eventType.set({ name, type_color });
        await eventType.save();

        return eventType;
    }

    static async deleteEventType(id) {
        const eventType = await EventType.findOne({ where: { id } });
        
        if (!eventType)
            throw new customException(404, "Event type not found");
        
        await eventType.destroy();

        return eventType;
    }

    static async getAllEventTypes() {
        const eventTypes = await EventType.findAll(); 
        return eventTypes;
    }

    

}