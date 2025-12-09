import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AutomationsService } from './automations.service';

@ApiTags('Automations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('automations')
export class AutomationsController {
  constructor(private automationsService: AutomationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all automations' })
  findAll(@Query('organizationId') organizationId: string) {
    return this.automationsService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get automation by ID' })
  findById(@Param('id') id: string) {
    return this.automationsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create automation' })
  create(
    @Query('organizationId') organizationId: string,
    @Body() body: { name: string; description?: string; triggerType: string },
  ) {
    return this.automationsService.create(organizationId, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update automation' })
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; isActive?: boolean },
  ) {
    return this.automationsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete automation' })
  delete(@Param('id') id: string) {
    return this.automationsService.delete(id);
  }

  @Post(':id/flow')
  @ApiOperation({ summary: 'Save flow' })
  saveFlow(@Param('id') id: string, @Body() body: { nodes: any[]; edges: any[] }) {
    return this.automationsService.saveFlow(id, body.nodes, body.edges);
  }

  @Post(':id/bots')
  @ApiOperation({ summary: 'Assign bots to automation' })
  assignToBots(@Param('id') id: string, @Body() body: { botIds: string[] }) {
    return this.automationsService.assignToBots(id, body.botIds);
  }
}
