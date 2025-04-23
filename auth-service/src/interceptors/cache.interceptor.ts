import { CACHE_KEY_METADATA, CacheInterceptor } from '@nestjs/cache-manager';
import { Injectable, type ExecutionContext } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers } = request;
    const token = headers.authorization?.split(' ')[1];

    if (method !== 'GET') {
      return undefined;
    }

    const handler = context.getHandler();
    const cacheKey = this.reflector.get<string>(CACHE_KEY_METADATA, handler);
    const cacheBy = this.reflector.get<string>('cacheBy', handler);

    const key = cacheKey || url;

    if (cacheBy === 'token') {
      return `${url}:${token || 'no-token'}`;
    }

    return key;
  }
}
