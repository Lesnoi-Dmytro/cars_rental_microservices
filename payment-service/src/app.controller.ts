import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthResponse } from 'src/classes/health-check/health-response.class';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({
    status: 200,
    description: 'Server is running',
    type: HealthResponse,
  })
  @Get()
  public getHello() {
    return this.appService.healthCheck();
  }
}
