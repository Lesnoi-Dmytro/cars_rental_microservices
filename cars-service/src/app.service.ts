import { Injectable } from '@nestjs/common';
import type { HealthResponse } from 'src/classes/health-check/health-response.class';

@Injectable()
export class AppService {
  public healthCheck(): HealthResponse {
    return {
      status: 'Server is running',
    };
  }
}
