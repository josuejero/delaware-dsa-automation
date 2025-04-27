// src/api/controllers/eventController.ts

import { Request, Response, NextFunction } from 'express';
import { EventService } from '../../services/eventService';

const eventService = new EventService();

export const eventController = {
  createEvent: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        title,
        description,
        startTime,
        endTime,
        location,
        actionNetworkId,
      } = req.body;

      if (
        typeof title !== 'string' ||
        !title.trim() ||
        !startTime ||
        !endTime
      ) {
        return res.status(400).json({
          error: 'Title, start time, and end time are required',
        });
      }

      const event = await eventService.createEvent({
        title: title.trim(),
        description:
          typeof description === 'string' ? description.trim() : undefined,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location:
          typeof location === 'string' && location.trim()
            ? location.trim()
            : undefined,
        actionNetworkId:
          typeof actionNetworkId === 'string' && actionNetworkId.trim()
            ? actionNetworkId.trim()
            : undefined,
      });

      return res.status(201).json(event);
    } catch (err) {
      console.error('Error creating event:', err);
      next(err);
    }
  },

  getEvent: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      const event = await eventService.findEvent(id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      return res.json(event);
    } catch (err) {
      console.error('Error fetching event:', err);
      next(err);
    }
  },

  listUpcomingEvents: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const events = await eventService.listUpcomingEvents();
      return res.json(events);
    } catch (err) {
      console.error('Error listing upcoming events:', err);
      next(err);
    }
  },

  registerForEvent: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const eventId = parseInt(req.params.id, 10);
      const memberId = parseInt(req.body.memberId as string, 10);

      if (isNaN(eventId) || isNaN(memberId)) {
        return res.status(400).json({
          error: 'Valid event ID and member ID are required',
        });
      }

      const registration = await eventService.registerForEvent(
        memberId,
        eventId
      );
      return res.status(201).json(registration);
    } catch (err) {
      console.error('Error registering for event:', err);
      next(err);
    }
  },
};
