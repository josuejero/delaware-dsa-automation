import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto'; // adjust file name/path if necessary
import { RegisterEventDto } from './dto/register-event.dto';
import { Event } from '../entities/event.entity';
import { Attendee } from '../entities/attendee';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const event: Event = await this.eventsService.create(createEventDto);
    // Map "title" to "name" to satisfy the required Event property
    const evt = event as { title: string, name?: string };
    evt.name = evt.title;
    // Sync with external services (Google Calendar, Discord)
    const syncedEvent: Event =
      await this.eventsService.syncWithExternalService(event);
    return syncedEvent;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
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
  ): Promise<Attendee> {
    const attendee: Attendee = await this.eventsService.registerAttendee(
      id,
      registerEventDto.memberId,
    );
    return attendee;
  }
}