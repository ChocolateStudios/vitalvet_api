import { customException } from "../exceptions/exceptionResponse.js";
import { Event } from "../models/Event.js";
import { EventType } from "../models/EventType.js";
import { Patient } from "../models/Patient.js";
import { Profile } from "../models/Profile.js";

export class EventService {
    static async createEvent(body, userId) {

        const { title, description, startTime, endTime, patientId, eventTypeId } = body;

        const profile = await Profile.findOne({ where: { userId } });

        if (!profile)
            throw customException(404, "Profile not found for this user");

        if (patientId) {
            const patient = await Patient.findOne({ where: { id: patientId } });

            if (!patient)
                throw customException(404, "Patient not found");
        }

        const eventType = await EventType.findOne({ where: { id: eventTypeId } })

        if (!eventType)
            throw customException(404, "Event type not found");

        let event = Event.build({ title, description, startTime, endTime, patientId, profileId: profile.id, eventTypeId });

        await event.save();
        
        event.endTime = event.endTime ? event.endTime : null;
        event.patientId = event.patientId ? event.patientId : null;

        return event;
    }
    
    static async updateEvent(body, id) {
        const event = await Event.findOne({ where: { id } });

        if (!event)
            throw customException(404, "Event not found");
            
        const { title, description, startTime, endTime, patientId, eventTypeId } = body;

        if (patientId) {
            const patient = await Patient.findOne({ where: { id: patientId } });

            if (!patient)
                throw customException(404, "Patient not found");
        }

        const eventType = await EventType.findOne({ where: { id: eventTypeId } })

        if (!eventType)
            throw customException(404, "Event type not found");

        event.set({ title, description, startTime, endTime, patientId, eventTypeId });

        await event.save();

        event.endTime = event.endTime ? event.endTime : null;
        event.patientId = event.patientId ? event.patientId : null;

        return event;
    }
    
    static async deleteEvent(id) {
        const event = await Event.findOne({ where: { id } });

        if (!event)
            throw customException(404, "Event not found");
            
        await event.destroy();

        return event;
    }
    
    static async getEventById(id) {
        const event = await Event.findOne({ where: { id } });

        if (!event)
            throw customException(404, "Event not found");

        return event;
    }
    
    static async getAllEvents() {
        const events = await Event.findAll();

        return events;
    }
}