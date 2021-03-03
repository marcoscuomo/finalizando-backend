// import AppError from '@shared/erros/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository'
import ListProviderAppointmentService from './ListProviderAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProviderAppointments: ListProviderAppointmentService;

describe('ListProiverAppointment', () => {

    beforeEach(() => {

        fakeAppointmentRepository  = new FakeAppointmentRepository();
        listProviderAppointments = new ListProviderAppointmentService(fakeAppointmentRepository);
    });

    it('Should be able to list the appointments on a specific day', async () => {

        const appointment1 =  await fakeAppointmentRepository.create({
            provider_id: 'provider',
            date: new Date(2020, 4, 20, 14, 0, 0),
            user_id: 'user'
        });

        const appointment2 = await fakeAppointmentRepository.create({
            provider_id: 'provider',
            date: new Date(2020, 4, 20, 15, 0, 0),
            user_id: 'user'
        });


        const appointments = await listProviderAppointments.execute({
            provider_id: 'provider',
            day: 20,
            year: 2020,
            month: 5
        });

        expect(appointments).toEqual(expect.arrayContaining([
            appointment1,
            appointment2
        ]))

    });
});
