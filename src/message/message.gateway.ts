import { Inject, Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { MessageService } from './message.service';

@WebSocketGateway({ cors: true })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @Inject()
  private messageService: MessageService;

  @WebSocketServer()
  private wss: Server;

  private logger: Logger = new Logger('MessageGateway');
  private count = 0;

  public async handleConnection(client: any) {
    this.count += 1;
    this.logger.log(`Connected: ${this.count} connection`);
    const messages = await this.messageService.getAll();
    client.emit('all-messages-to-client', messages);
  }

  handleDisconnect() {
    this.count -= 1;
    this.logger.log(`Disconnected: ${this.count} connections`);
  }

  afterInit() {
    this.logger.log(`Message Gateway initialized`);
  }

  @SubscribeMessage('new-message-to-server')
  public async handleNewMessage(
    @MessageBody() data: { sender: string; message: string },
  ): Promise<void> {
    const message = await this.messageService.createMessage(
      data.sender,
      data.message,
    );
    this.wss.emit('new-message-to-client', { message });
  }
}
