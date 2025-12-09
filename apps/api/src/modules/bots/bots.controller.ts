import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BotsService } from './bots.service';

@ApiTags('Bots')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('bots')
export class BotsController {
  constructor(private botsService: BotsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bots' })
  findAll(@Query('organizationId') organizationId: string) {
    return this.botsService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bot by ID' })
  findById(@Param('id') id: string) {
    return this.botsService.findById(id);
  }

  @Post('telegram')
  @ApiOperation({ summary: 'Create Telegram bot' })
  createTelegram(
    @Query('organizationId') organizationId: string,
    @Body() body: { name: string; token: string },
  ) {
    return this.botsService.createTelegram(organizationId, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update bot' })
  update(@Param('id') id: string, @Body() body: { name?: string; isActive?: boolean }) {
    return this.botsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete bot' })
  delete(@Param('id') id: string) {
    return this.botsService.delete(id);
  }
}
