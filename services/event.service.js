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

        const patient = await Patient.findOne({ where: { id: patientId } });

        if (!patient)
            throw customException(404, "Patient not found");

        const eventType = await EventType.findOne({ where: { id: eventTypeId } })

        if (!eventType)
            throw customException(404, "Event type not found");

        const event = Event.build({ title, description, startTime, endTime, patientId, profileId: profile.id, eventTypeId });

        await event.save();

        return event;
    }
}