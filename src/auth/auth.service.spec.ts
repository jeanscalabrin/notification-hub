import { AuthModule } from '@/auth/auth.module';
import { AuthService } from '@/auth/auth.service';
import { PrismaService } from '@/prisma.service';
import { UsersModule } from '@/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

describe('AuthService Integration', () => {
  let authService: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AuthModule, UsersModule],
    }).compile();

    authService = module.get(AuthService);
    prisma = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should persist a user', async () => {
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234',
    };

    const user = await authService.signUp(dto);

    const persisted = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    expect(persisted).not.toBeNull();
  });

  it('should hash password before persisting', async () => {
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234',
    };

    const user = await authService.signUp(dto);

    const persisted = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    expect(persisted!.passwordHash).not.toBe(dto.password);
  });

  it('should reject duplicated email', async () => {
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234',
    };

    await authService.signUp(dto);

    await expect(authService.signUp(dto)).rejects.toThrow();
  });

  it('should return an access token', async () => {
    await authService.signUp({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const result = await authService.signIn({
      email: 'john@example.com',
      password: '123456',
    });

    expect(result.accessToken).toBeDefined();
  });

  it('should reject invalid password', async () => {
    await authService.signUp({
      name: 'John Doe',
      email: 'john@example.com',
      password: '12345',
    });

    await expect(
      authService.signIn({ email: 'john@example.com', password: '1234' }),
    ).rejects.toThrow();
  });

  it('should reject unknown user', async () => {
    await expect(
      authService.signIn({ email: 'john@example.com', password: '1234' }),
    ).rejects.toThrow();
  });

  it('should generate token with correct payload', async () => {
    const user = await authService.signUp({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const result = await authService.signIn({
      email: 'john@example.com',
      password: '123456',
    });

    const payload = jwtService.verify(result.accessToken);

    expect(payload.sub).toBe(user.id);
    expect(payload.email).toBe(user.email);
  });
});
