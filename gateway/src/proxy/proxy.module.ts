import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { ClientRequest } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Module({})
export class ProxyModule implements NestModule {
  private AUTH_SERVICE_URL: string;
  private CARS_SERVICE_URL: string;
  private RESERVATIONS_SERVICE_URL: string;
  private PAYMENT_SERVICE_URL: string;

  constructor(config: ConfigService) {
    this.AUTH_SERVICE_URL =
      config.get<string>('AUTH_SERVICE_URL') ?? 'http://localhost:3001';
    this.CARS_SERVICE_URL =
      config.get<string>('CARS_SERVICE_URL') ?? 'http://localhost:3002';
    this.RESERVATIONS_SERVICE_URL =
      config.get<string>('RESERVATIONS_SERVICE_URL') ?? 'http://localhost:3003';
    this.PAYMENT_SERVICE_URL =
      config.get<string>('PAYMENT_SERVICE_URL') ?? 'http://localhost:3004';
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        createProxyMiddleware({
          pathFilter: (path) =>
            path.startsWith('/api/auth') || path.startsWith('/api/users'),
          target: this.AUTH_SERVICE_URL,
          changeOrigin: true,
          on: {
            proxyReq: onProxyReq(this.AUTH_SERVICE_URL),
          },
        }),
        createProxyMiddleware({
          pathFilter: (path) => path.startsWith('/api/cars'),
          target: this.CARS_SERVICE_URL,
          changeOrigin: true,
          on: {
            proxyReq: onProxyReq(this.CARS_SERVICE_URL),
          },
        }),
        createProxyMiddleware({
          pathFilter: (path) =>
            path.startsWith('/api/reservation') ||
            path.startsWith('/api/damage-report'),
          target: this.RESERVATIONS_SERVICE_URL,
          changeOrigin: true,
          on: {
            proxyReq: onProxyReq(this.RESERVATIONS_SERVICE_URL),
          },
        }),
        createProxyMiddleware({
          pathFilter: (path) => path.startsWith('/api/payment'),
          target: this.PAYMENT_SERVICE_URL,
          changeOrigin: true,
          on: {
            proxyReq: onProxyReq(this.PAYMENT_SERVICE_URL),
          },
        }),
      )
      .forRoutes({ path: '/*path', method: RequestMethod.ALL });
  }
}

function onProxyReq(url: string) {
  return (proxyReq: ClientRequest, req: Request) => {
    if (
      req.body &&
      ['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase())
    ) {
      const bodyData = JSON.stringify(req.body);

      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }

    console.log(
      `[NestMiddleware]: Proxying '[${req.method}] ${req.originalUrl}' to target '[${proxyReq.method}] ${url}${proxyReq.path}'`,
    );
  };
}
