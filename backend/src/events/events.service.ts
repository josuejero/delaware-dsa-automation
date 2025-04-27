import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event, EventAttendee } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    return this.prisma.event.create({
      data: {
        title: createEventDto.title,
        description: createEventDto.description,
        startTime: new Date(createEventDto.startTime),
        endTime: new Date(createEventDto.endTime),
        location: createEventDto.location,
        actionNetworkId: createEventDto.actionNetworkId,
      },
    });
  }

  async findAll(): Promise<Event[]> {
    return this.prisma.event.findMany({
      orderBy: { startTime: 'asc' },
    });
  }

  async findUpcoming(): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        startTime: {
          gte: new Date(),
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(id: number): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: { id },
      include: { attendees: true },
    });
  }

  async registerAttendee(eventId: number, memberId: number): Promise<EventAttendee> {
    return this.prisma.eventAttendee.upsert({
      where: {
        memberId_eventId: {
          memberId,
          eventId,
        },
      },
      update: {
        status: 'registered',
      },
      create: {
        memberId,
        eventId,
        status: 'registered',
      },
    });
  }

  async syncWithExternalService(event: Event): Promise<Event> {
    // Placeholder for syncing with Google Calendar and Discord
    // In a real implementation, this would call those services
    return this.prisma.event.update({
      where: { id: event.id },
      data: {
        googleCalendarId: `gc_${event.id}`,
        discordEventId: `dc_${event.id}`,
      },
    });
  }
}
