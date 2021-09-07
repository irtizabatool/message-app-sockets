import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MessageService, MessageGateway],
})
export class MessageModule {}
