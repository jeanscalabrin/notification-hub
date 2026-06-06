import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '@/prisma.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService, PrismaService],
    }).compile();

    prisma = module.get(PrismaService);
    service = module.get<NotificationsService>(NotificationsService);
  });

  beforeEach(async () => {
    await prisma.notification.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a notification', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'john@example.com',
        name: 'John',
        passwordHash: 'hash',
      },
    });

    const notif = await service.create(user.id, {
      title: 'Welcome',
      body: 'Hello',
    });

    expect(notif).toMatchObject({
      userId: user.id,
      title: 'Welcome',
      body: 'Hello',
      status: 'PENDING',
    });
  });

  it('should return all notifications from user', async () => {
    const user1 = await prisma.user.create({
      data: {
        email: 'john@example.com',
        name: 'John',
        passwordHash: 'hash',
      },
    });
    const user2 = await prisma.user.create({
      data: {
        email: 'maria@example.com',
        name: 'Maria',
        passwordHash: 'hash',
      },
    });
    await prisma.notification.create({
      data: {
        userId: user1.id,
        title: 'N1',
        body: 'Body',
      },
    });
    await prisma.notification.create({
      data: {
        userId: user1.id,
        title: 'N2',
        body: 'Body',
      },
    });
    await prisma.notification.create({
      data: {
        userId: user2.id,
        title: 'N3',
        body: 'Body',
      },
    });
    const result = await service.findAll(user1.id);
    expect(result).toHaveLength(2);
  });
});
