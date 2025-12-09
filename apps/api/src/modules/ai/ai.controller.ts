import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate AI response' })
  generate(@Body() body: { systemPrompt?: string; userMessage: string; model?: string }) {
    return this.aiService.generate(body);
  }

  @Post('improve')
  @ApiOperation({ summary: 'Improve text' })
  improve(@Body() body: { text: string; style: string }) {
    return this.aiService.improve(body);
  }

  @Post('content-ideas')
  @ApiOperation({ summary: 'Generate content ideas' })
  contentIdeas(@Body() body: { topic: string; count: number }) {
    return this.aiService.contentIdeas(body);
  }
}
