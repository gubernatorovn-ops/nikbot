import { Module } from '@nestjs/common';
import { AutomationsController } from './automations.controller';
import { AutomationsService } from './automations.service';
import { FlowExecutorService } from './flow-executor.service';
import { BotsModule } from '../bots/bots.module';

@Module({
  imports: [BotsModule],
  controllers: [AutomationsController],
  providers: [AutomationsService, FlowExecutorService],
  exports: [AutomationsService, FlowExecutorService],
})
export class AutomationsModule {}
