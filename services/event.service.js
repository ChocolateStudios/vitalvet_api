import { customException } from "../exceptions/exceptionResponse.js";
import Event from "../models/Event.js";
import EventType from "../models/EventType.js";
import Patient from "../models/Patient.js";
import Profile from "../models/Profile.js";

export class EventService {
    static async createEvent(body, user_id) {

        const { title, description, startTime, endTime, patientId, eventTypeId} = body;

        const profile = await Profile.findOne({ where: {user_id} });
        
        if (!profile)
            throw customException(404, "Profile not found for this user");

        const patient = await Patient.findOne({ where: {id: patientId} });
        
        if (!patient)
            throw customException(404, "Patient not found");
        
        const eventType = await EventType.findOne({ where: {id: eventTypeId} })

        if (!eventType)
            throw customException(404, "Event type not found");
        
        const event = Event.build({
            title,
            description,
            start_time: startTime,
            end_time: endTime,
            patient_id: patientId,
            profile_id: profile.id,
            event_type_id: eventTypeId
        });

        await event.save();

        return event;
    }
}