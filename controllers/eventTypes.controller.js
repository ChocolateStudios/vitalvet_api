import EventTypes from "../models/EventTypes";

export const createEventTypes = async (req, res) => {
    const { name, type_color } = req.body;
    try { 
        const eventTypes = new EventTypes({ name, type_color});
        await eventTypes.save();

        return res.status(201).json({name, type_color});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'server error' });
    }
}