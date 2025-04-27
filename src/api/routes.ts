// src/api/routes.ts

import { Router, RequestHandler } from 'express';
import { membershipController } from './controllers/membershipController';
import { eventController }     from './controllers/eventController';

const router = Router();

// Membership routes
router.post(
  '/members',
  membershipController.createMember as RequestHandler
);
router.get(
  '/members/:id',
  membershipController.getMember as RequestHandler
);
router.put(
  '/members/:id/status',
  membershipController.updateMemberStatus as RequestHandler
);
router.get(
  '/members',
  membershipController.listMembers as RequestHandler
);

// Event routes
router.post(
  '/events',
  eventController.createEvent as RequestHandler
);
router.get(
  '/events/:id',
  eventController.getEvent as RequestHandler
);
router.get(
  '/events',
  eventController.listUpcomingEvents as RequestHandler
);
router.post(
  '/events/:id/register',
  eventController.registerForEvent as RequestHandler
);

export default router;
