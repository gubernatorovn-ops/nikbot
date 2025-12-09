import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../config/prisma.service';
import Redis from 'ioredis';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private redis: Redis,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  async check() {
    const checks = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        api: 'ok',
        database: 'unknown',
        redis: 'unknown',
      },
    };

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.services.database = 'ok';
    } catch (error) {
      checks.services.database = 'error';
      checks.status = 'degraded';
    }

    try {
      await this.redis.ping();
      checks.services.redis = 'ok';
    } catch (error) {
      checks.services.redis = 'error';
      checks.status = 'degraded';
    }

    return checks;
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check' })
  live() {
    return { alive: true };
  }
}
