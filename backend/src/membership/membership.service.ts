import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Member } from '@prisma/client';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberStatusDto } from './dto/update-member-status.dto';

@Injectable()
export class MembershipService {
  constructor(private prisma: PrismaService) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    return this.prisma.member.create({
      data: {
        ...createMemberDto,
        status: 'pending',
      },
    });
  }

  async findAll(page = 1, limit = 10): Promise<{ items: Member[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [items, total] = await Promise.all([
      this.prisma.member.findMany({
        skip,
        take: limit,
        orderBy: { joinedAt: 'desc' },
      }),
      this.prisma.member.count(),
    ]);

    return { items, total };
  }

  async findOne(id: number): Promise<Member | null> {
    return this.prisma.member.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Member | null> {
    return this.prisma.member.findUnique({
      where: { email },
    });
  }

  async updateStatus(id: number, updateMemberStatusDto: UpdateMemberStatusDto): Promise<Member> {
    return this.prisma.member.update({
      where: { id },
      data: { status: updateMemberStatusDto.status },
    });
  }

  async findWithExpiringSoon(daysThreshold = 30): Promise<Member[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    return this.prisma.member.findMany({
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
