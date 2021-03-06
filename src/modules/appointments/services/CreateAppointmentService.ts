import { startOfHour, isBefore, getHours, format } from 'date-fns';
// import { getCustomRepository } from 'typeorm';
import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';
import AppError from '@shared/erros/AppError';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

interface IRequestDTO {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentRepository: IAppointmentRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository
    ) {

    }

    public async execute({date, provider_id, user_id}: IRequestDTO): Promise<Appointment> {

        // const appointmentRepository = getCustomRepository(AppointmentRepository);

        const appointmentDate = startOfHour(date);

        if(isBefore(appointmentDate, Date.now())){
            throw new AppError("You can't create an appointment on a past date.");
        }

        if(user_id === provider_id){
            throw new AppError("You can't create an appointment with yourself");
        }

        if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17){
            throw new AppError("You can't create an appointment between 8am and 5pm");
        }

        const findAppointmentInSameDate = await this.appointmentRepository.findByDate(
            appointmentDate
        );

        if(findAppointmentInSameDate){
            throw new AppError('This appointment is already booked');
        }

        // Criamos o objeto, a instância
        const appointment = await this.appointmentRepository.create({
            provider_id,
            user_id,
            date: appointmentDate
        });

        const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para o dia ${dateFormatted}`
        });

        return appointment;

    }
}

export default CreateAppointmentService;
