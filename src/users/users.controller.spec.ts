import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@example.com',
          password: 'password',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'password',
          } as User,
        ]);
      },
      // update: () => {},
      // remove: () => {},
    };

    fakeAuthService = {
      // signup: () => {},
      login: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns a list of all users with a given email', async () => {
    const users = await controller.findAllUsers('test@example.com');
    expect(users).toEqual([
      {
        id: 1,
        email: 'test@example.com',
        password: 'password',
      },
    ]);
  });

  it('findUser returns a single user with a given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('login and updates session object and returns a user', async () => {
    const session = { userId: -1 };
    const user = await controller.login(
      {
        email: 'test@test.com',
        password: 'password',
      },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
