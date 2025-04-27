// src/api/controllers/membershipController.ts

import { Request, Response, NextFunction } from 'express';
import { MembershipService } from '../../services/membershipService';

const membershipService = new MembershipService();

export const membershipController = {
  createMember: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, name } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      const member = await membershipService.createMember(email, name);
      return res.status(201).json(member);
    } catch (err) {
      console.error('Error creating member:', err);
      next(err);
    }
  },

  getMember: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid member ID' });
      }
      const member = await membershipService.findMember(id);
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }
      return res.json(member);
    } catch (err) {
      console.error('Error fetching member:', err);
      next(err);
    }
  },

  updateMemberStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid member ID' });
      }
      if (typeof status !== 'string' || !status.trim()) {
        return res.status(400).json({ error: 'Status is required' });
      }
      const updated = await membershipService.updateMemberStatus(id, status);
      return res.json(updated);
    } catch (err) {
      console.error('Error updating member status:', err);
      next(err);
    }
  },

  listMembers: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const pageSize = Math.max(1, parseInt(req.query.pageSize as string, 10) || 10);
      const result = await membershipService.listMembers(page, pageSize);
      return res.json(result);
    } catch (err) {
      console.error('Error listing members:', err);
      next(err);
    }
  },
};
