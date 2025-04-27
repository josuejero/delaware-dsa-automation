import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActionNetworkWebhookDto } from './dto/action-network-webhook.dto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private prisma: PrismaService) {}

  async processActionNetworkWebhook(
    signature: string,
    payload: ActionNetworkWebhookDto,
  ): Promise<void> {
    // In a real implementation, validate the signature first
    // For now, we'll just log and process the webhook

    this.logger.log(`Received Action Network webhook: ${payload.action}`);

    try {
      switch (payload.action) {
        case 'person.signup':
          await this.handlePersonSignup(payload);
          break;
        case 'event.created':
          await this.handleEventCreated(payload);
          break;
        default:
          this.logger.warn(`Unhandled Action Network action: ${payload.action}`);
      }
    } catch (error) {
      this.logger.error(
        `Error processing Action Network webhook: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async handlePersonSignup(payload: ActionNetworkWebhookDto): Promise<void> {
    if (!payload.person) {
      this.logger.warn('Person signup webhook missing person data');
      return;
    }

    const { email_address, given_name, family_name, status } = payload.person;
    const name = [given_name, family_name].filter(Boolean).join(' ');

    await this.prisma.member.upsert({
      where: { email: email_address },
      update: {
        name: name || undefined,
        status: status || 'pending',
      },
      create: {
        email: email_address,
        name: name || undefined,
        status: status || 'pending',
      },
    });

    this.logger.log(`Member signup processed for ${email_address}`);
  }

  private async handleEventCreated(payload: ActionNetworkWebhookDto): Promise<void> {
    if (!payload.event) {
      this.logger.warn('Event created webhook missing event data');
      return;
    }

    const { title, description, start_date, end_date, location, identifiers } = payload.event;

    await this.prisma.event.upsert({
      where: { actionNetworkId: identifiers },
      update: {
        title,
        description,
        startTime: new Date(start_date),
        endTime: end_date ? new Date(end_date) : new Date(new Date(start_date).getTime() + 3600000), // +1 hour if not specified
        location,
      },
      create: {
        title,
        description,
        startTime: new Date(start_date),
        endTime: end_date ? new Date(end_date) : new Date(new Date(start_date).getTime() + 3600000),
        location,
        actionNetworkId: identifiers,
      },
    });

    this.logger.log(`Event created processed for ${title}`);
  }
}
