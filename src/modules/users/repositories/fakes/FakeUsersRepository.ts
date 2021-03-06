import { uuid } from 'uuidv4';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import Users from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class FakeUsersRepository implements IUserRepository {

    private users: Users[] = [];

    public async findById(id: string): Promise<Users | undefined> {

        const findUser = this.users.find(user => user.id == id);

        return findUser;
    }

    public async findyByEmail(email: string): Promise<Users | undefined> {
        const findUser = this.users.find(user => user.email == email);

        return findUser;
    }


    public async create({name, email, password}: ICreateUserDTO): Promise<Users> {

        const user = new Users();

        Object.assign(user, {id: uuid(), name, email, password});

        this.users.push(user);

        return user;
    }

    public async save(user: Users): Promise<Users> {
        const findIndex = this.users.findIndex(findUser => findUser.id == user.id);

        this.users[findIndex] = user;

        return user;
    }

    public async findAllProviders({except_user_id}: IFindAllProvidersDTO): Promise<Users[]> {

        // let users = this.users;
        let { users } = this;

        if(except_user_id){
            users = this.users.filter(user => user.id !== except_user_id);
        }

        return users;
    }


}

export default FakeUsersRepository;
