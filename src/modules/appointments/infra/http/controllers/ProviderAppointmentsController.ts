import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import ListProviderAppointmentService from '@modules/appointments/services/ListProviderAppointmentService';

export default class ProviderAppintmentsController {
    public async index(request: Request, response: Response): Promise<Response>{
        const provider_id = request.user.id;
        const { day, month, year } = request.body;

        const listProviderAppointmentService = container.resolve(ListProviderAppointmentService);

        const appointments = await listProviderAppointmentService.execute({
            provider_id,
            day,
            month,
            year
        });

        return response.json(appointments);
    }
}
