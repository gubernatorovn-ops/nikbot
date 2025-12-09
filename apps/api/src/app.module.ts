import { Module } from '@nestjs/common';
import { PrismaModule } from './config/prisma.module';
import { RedisModule } from './config/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { BotsModule } from './modules/bots/bots.module';
import { AutomationsModule } from './modules/automations/automations.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AiModule } from './modules/ai/ai.module';
import { BillingModule } from './modules/billing/billing.module';
import { HealthModule } from './modules/health/health.module';
import { QueueModule } from './queues/queue.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    QueueModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    BotsModule,
    AutomationsModule,
    ContactsModule,
    MessagesModule,
    AiModule,
    BillingModule,
    HealthModule,
  ],
})
export class AppModule {}
