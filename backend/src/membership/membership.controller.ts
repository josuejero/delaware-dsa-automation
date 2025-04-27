import { Controller, Get, Post, Body, Param, Put, Query, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberStatusDto } from './dto/update-member-status.dto';

@Controller('api/members')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post()
  async create(@Body() createMemberDto: CreateMemberDto) {
    return this.membershipService.create(createMemberDto);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.membershipService.findAll(+page, +limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const member = await this.membershipService.findOne(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMemberStatusDto: UpdateMemberStatusDto,
  ) {
    return this.membershipService.updateStatus(id, updateMemberStatusDto);
  }

  @Get('due-expiring')
  async findWithExpiringSoon(@Query('days') days: string = '30') {
    return this.membershipService.findWithExpiringSoon(+days);
  }
}
