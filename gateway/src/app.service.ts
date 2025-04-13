import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AxiosResponse } from 'axios';
import {
  HealthResponse,
  ServicesHealthResponse,
} from 'src/classes/health-check/health-response.class';

@Injectable()
export class AppService {
  private AUTH_SERVICE_URL: string;
  private CARS_SERVICE_URL: string;
  private RESERVATIONS_SERVICE_URL: string;
  private PAYMENT_SERVICE_URL: string;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.AUTH_SERVICE_URL =
      config.get<string>('AUTH_SERVICE_URL') ?? 'http://localhost:3001';
    this.CARS_SERVICE_URL =
      config.get<string>('CARS_SERVICE_URL') ?? 'http://localhost:3002';
    this.RESERVATIONS_SERVICE_URL =
      config.get<string>('RESERVATIONS_SERVICE_URL') ?? 'http://localhost:3003';
    this.PAYMENT_SERVICE_URL =
      config.get<string>('PAYMENT_SERVICE_URL') ?? 'http://localhost:3004';
  }

  public async healthCheck(): Promise<ServicesHealthResponse> {
    let responses: PromiseSettledResult<AxiosResponse<HealthResponse>>[] = [];
    try {
      responses = await Promise.allSettled([
        this.http.axiosRef.get<HealthResponse>(`${this.AUTH_SERVICE_URL}/api`),
        this.http.axiosRef.get<HealthResponse>(`${this.CARS_SERVICE_URL}/api`),
        this.http.axiosRef.get<HealthResponse>(
          `${this.RESERVATIONS_SERVICE_URL}/api`,
        ),
        this.http.axiosRef.get<HealthResponse>(
          `${this.PAYMENT_SERVICE_URL}/api`,
        ),
      ]);

      return {
        authStatus: this.getServiceStatus(responses[0]),
        carsStatus: this.getServiceStatus(responses[1]),
        reservationsStatus: this.getServiceStatus(responses[2]),
        paymentStatus: this.getServiceStatus(responses[3]),
      };
    } catch (error) {
      console.error('Error during health check:', error);
      return {
        authStatus: 'FAILURE: Unable to check Auth Service',
        carsStatus: 'FAILURE: Unable to check Cars Service',
        reservationsStatus: 'FAILURE: Unable to check Reservations Service',
        paymentStatus: 'FAILURE: Unable to check Payment Service',
      };
    }
  }

  private getServiceStatus(
    response: PromiseSettledResult<AxiosResponse<HealthResponse>>,
  ): string {
    if (response.status === 'fulfilled') {
      return response.value.data.status;
    } else {
      return 'DOWN';
    }
  }
}
