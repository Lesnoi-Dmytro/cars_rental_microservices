import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthResponse } from 'src/classes/health-check/health-response.class';
import { Public } from 'src/auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({
    status: 200,
    description: 'Server is running',
    type: HealthResponse,
  })
  @Public()
  @Get()
  public getHello() {
    return this.appService.healthCheck();
  }
}
