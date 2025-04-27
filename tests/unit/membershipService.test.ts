import { MembershipService } from '../../src/services/membershipService';
import { PrismaClient } from '@prisma/client';

// Mock Prisma client
jest.mock('@prisma/client', () => {
  const mockCreate = jest.fn().mockResolvedValue({
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    status: 'pending',
    joinedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const mockFindUnique = jest.fn().mockResolvedValue({
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    status: 'pending',
    joinedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      member: {
        create: mockCreate,
        findUnique: mockFindUnique,
        update: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
      : jest.fn(),
    })),
  };
});

describe('MembershipService', () => {
  let service: MembershipService;
  
  beforeEach(() => {
    service = new MembershipService();
  });
  
  test('createMember should create a member with pending status', async () => {
    const result = await service.createMember('test@example.com', 'Test User');
    
    expect(result).toBeDefined();
    expect(result.email).toBe('test@example.com');
    expect(result.name).toBe('Test User');
    expect(result.status).toBe('pending');
  });
  
  test('findMember should return a member by ID', async () => {
    const result = await service.findMember(1);
    
    expect(result).toBeDefined();
    expect(result?.id).toBe(1);
  });
});
