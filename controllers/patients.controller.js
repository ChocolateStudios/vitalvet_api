import { exceptionResponse } from '../exceptions/exceptionResponse.js';
import { PatientService } from '../services/patient.service.js';

export const createPatient = async (req, res) => {
    try {
        const patient = await PatientService.createPatient(req.body, req.uid);
        return res.status(201).json(patient);
    } catch (error) {
        const { code, message } = exceptionResponse(error);
        return res.status(code).json({ message });
    }
};

// export const updatePatient = async (req, res) => {
//     try {
//         const patient = await PatientService.updatePatient(req.body, req.uid);
//         return res.status(200).json(patient);
//     } catch (error) {
//         const { code, message } = exceptionResponse(error);
//         return res.status(code).json({ message });
//     }
// };

// export const deletePatient = async (req, res) => {
//     try {
//         const patient = await PatientService.deletePatient(req.body, req.uid);
//         return res.status(200).json(patient);
//     } catch (error) {
//         const { code, message } = exceptionResponse(error);
//         return res.status(code).json({ message });
//     }
// };