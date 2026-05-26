import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should return user created', () => {
    expect(
      controller.signupUser({
        name: 'Jean',
        email: 'jean@exemple.com',
        password: '1234',
      }),
    ).toBe('Hello World!');
  });
});
