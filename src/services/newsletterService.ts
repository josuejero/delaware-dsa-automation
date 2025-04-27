import { PrismaClient, Newsletter } from '@prisma/client';

const prisma = new PrismaClient();

export class NewsletterService {
  /**
   * Create a new newsletter draft
   */
  async createNewsletter(newsletterData: {
    title: string;
    templateId?: string;
    content?: string;
    scheduledDate?: Date;
  }): Promise<Newsletter> {
    return prisma.newsletter.create({
      data: {
        ...newsletterData,
        status: 'draft',
      },
    });
  }

  /**
   * Schedule a newsletter for sending
   */
  async scheduleNewsletter(id: number, scheduledDate: Date): Promise<Newsletter> {
    return prisma.newsletter.update({
      where: { id },
      data: {
        scheduledDate,
        status: 'scheduled',
      },
    });
  }

  /**
   * Mark a newsletter as sent
   */
  async markAsSent(id: number): Promise<Newsletter> {
    return prisma.newsletter.update({
      where: { id },
      data: {
        sentDate: new Date(),
        status: 'sent',
      },
    });
  }

  /**
   * Update engagement metrics
   */
  async updateEngagementMetrics(id: number, openCount: number, clickCount: number): Promise<Newsletter> {
    return prisma.newsletter.update({
      where: { id },
      data: {
        openCount,
        clickCount,
      },
    });
  }
}
