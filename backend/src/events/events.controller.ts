import { Controller, Get, Post, Body, Param, Query, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';

@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    const event = await this.eventsService.create(createEventDto);
    // Sync with external services (Google Calendar, Discord)
    return this.eventsService.syncWithExternalService(event);
  }

  @Get()
  async findAll(@Query('upcoming') upcoming: string) {
    if (upcoming === 'true') {
      return this.eventsService.findUpcoming();
    }
    return this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.findOne(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  @Post(':id/register')
  async registerForEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() registerEventDto: RegisterEventDto,
  ) {
    return this.eventsService.registerAttendee(id, registerEventDto.memberId);
  }
}
