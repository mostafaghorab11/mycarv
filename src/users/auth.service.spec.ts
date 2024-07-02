import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create a fake copy of the user service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with hashed password', async () => {
    const user = await service.signup('test@example.com', 'password123');
    expect(user.password).not.toBe('password123');
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if login is called with an unused email', async () => {
    await expect(
      service.login('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    const testEmail = 'test@test.com';
    const testPassword = 'secret123';
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          email: testEmail,
          password: testPassword,
        } as User,
      ]);
    // Attempt login with an incorrect password
    await expect(service.login(testEmail, testPassword)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          email: 'test@test.com',
          password:
            '$2b$10$84EiwQpYZ9p2d8ER//8tW.i2LkolCBxDWsluXGHDrFUECYWg/W48C',
        } as User,
      ]);
    const user = await service.login('test@test.com', 'mypassword');
    expect(user.email).toBeDefined();
  });
});
