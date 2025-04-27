import { Controller, Post, Headers, Body, HttpCode } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { ActionNetworkWebhookDto } from './dto/action-network-webhook.dto';

@Controller('api/webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('action-network')
  @HttpCode(200) // Respond with 200 OK immediately
  async handleActionNetwork(
    @Headers('x-an-signature') signature: string = '',
    @Body() payload: ActionNetworkWebhookDto,
  ) {
    await this.webhooksService.processActionNetworkWebhook(signature, payload);
    return { received: true };
  }
}
