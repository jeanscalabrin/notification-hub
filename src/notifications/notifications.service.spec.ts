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

  it('should not return notifications from another user', async () => {
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
    const result = await service.findAll(user2.id);
    expect(result).toHaveLength(1);
  });

  it('should return notification by id', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'john@example.com',
        name: 'John',
        passwordHash: 'hash',
      },
    });

    const notif = await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'N1',
        body: 'Body',
      },
    });

    const result = await service.findById(user.id, notif.id);
    expect(result).toBeDefined();
  });
  it('should throw when notification does not exist', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'john@example.com',
        name: 'John',
        passwordHash: 'hash',
      },
    });

    await expect(
      service.findById(user.id, '01936c0a-5e0c-7b3a-8f9d-2e1c4a6b8d0f'),
    ).rejects.toThrow();
  });

  it('should not allow access to another user notification', async () => {
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

    const notif = await prisma.notification.create({
      data: {
        userId: user1.id,
        title: 'N1',
        body: 'Body',
      },
    });

    await expect(service.findById(user2.id, notif.id)).rejects.toThrow();
  });
});
