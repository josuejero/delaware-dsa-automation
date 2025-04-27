import { Test, TestingModule } from '@nestjs/testing';
import { MembershipService } from '../../src/membership/membership.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateMemberDto } from '../../src/membership/dto/create-member.dto';

// Mock PrismaService
const mockPrismaService = {
  member: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
};

describe('MembershipService', () => {
  let service: MembershipService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MembershipService>(MembershipService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new member with pending status', async () => {
      const dto: CreateMemberDto = { email: 'test@example.com', name: 'Test User' };
      const expectedResult = { 
        id: 1, 
        ...dto, 
        status: 'pending',
        joinedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockPrismaService.member.create.mockResolvedValue(expectedResult);
      
      const result = await service.create(dto);
      expect(result).toEqual(expectedResult);
      expect(prisma.member.create).toHaveBeenCalledWith({
        data: { ...dto, status: 'pending' },
      });
    });
  });
});
