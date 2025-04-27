import { PrismaClient, Member } from '@prisma/client';

const prisma = new PrismaClient();

export class MembershipService {
  /**
   * Create a new member with pending status
   */
  async createMember(email: string, name?: string): Promise<Member> {
    return prisma.member.create({
      data: {
        email,
        name,
        status: 'pending',
      },
    });
  }

  /**
   * Find a member by ID
   */
  async findMember(id: number): Promise<Member | null> {
    return prisma.member.findUnique({
      where: { id },
    });
  }

  /**
   * Find a member by email
   */
  async findMemberByEmail(email: string): Promise<Member | null> {
    return prisma.member.findUnique({
      where: { email },
    });
  }

  /**
   * Update a member's status
   */
  async updateMemberStatus(id: number, status: string): Promise<Member> {
    return prisma.member.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * List all members with pagination
   */
  async listMembers(page = 1, pageSize = 10): Promise<{ members: Member[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const [members, total] = await Promise.all([
      prisma.member.findMany({
        skip,
        take: pageSize,
        orderBy: { joinedAt: 'desc' },
      }),
      prisma.member.count(),
    ]);

    return { members, total };
  }

  /**
   * Find members with soon-to-expire dues
   */
  async findMembersWithExpiringSoon(daysThreshold = 30): Promise<Member[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    return prisma.member.findMany({
      where: {
        status: 'current',
        duesExpiry: {
          lte: thresholdDate,
          gt: new Date(),
        },
      },
    });
  }
}
