import { PrismaClient, Event, EventAttendee } from '@prisma/client';

const prisma = new PrismaClient();

export class EventService {
  /**
   * Create a new event
   */
  async createEvent(eventData: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    actionNetworkId?: string;
  }): Promise<Event> {
    return prisma.event.create({
      data: eventData,
    });
  }

  /**
   * Find an event by ID
   */
  async findEvent(id: number): Promise<Event | null> {
    return prisma.event.findUnique({
      where: { id },
      include: { attendees: true },
    });
  }

  /**
   * Update event details
   */
  async updateEvent(id: number, data: Partial<Event>): Promise<Event> {
    return prisma.event.update({
      where: { id },
      data,
    });
  }

  /**
   * List upcoming events
   */
  async listUpcomingEvents(): Promise<Event[]> {
    return prisma.event.findMany({
      where: {
        startTime: {
          gte: new Date(),
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  /**
   * Register a member for an event
   */
  async registerForEvent(memberId: number, eventId: number): Promise<EventAttendee> {
    return prisma.eventAttendee.upsert({
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
}
