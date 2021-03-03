import AppError from '@shared/erros/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProiver from '../providers/HashProviders/fakes/FakeHashProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUserRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository, fakeStorageProvider);
    });

    it('should be able to create a new user', async () => {

        const user = await fakeUserRepository.create({
            name: 'Marcos',
            email: 'marco@uol.com',
            password: '1243'
        });


        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFileName: 'avatar.jpg'
        });

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update avatar from non existing user', async () => {

        await expect(
            updateUserAvatar.execute({
                user_id: 'non-existing-user',
                avatarFileName: 'avatar.jpg'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when updating new one', async () => {

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
        const user = await fakeUserRepository.create({
            name: 'Marcos',
            email: 'marco@uol.com',
            password: '1243'
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFileName: 'avatar.jpg'
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFileName: 'avatar2.jpg'
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(user.avatar).toBe('avatar2.jpg');
    });
});