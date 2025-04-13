import type { PageRequest } from 'src/classes/pagination/page-request.class';
import {
  SortOrder,
  type SortableRequest,
} from 'src/classes/pagination/sortable-request.class';

export function getPaginationFilter(request: PageRequest): {
  skip: number;
  take: number;
} {
  const { page = 1, limit = 10 } = request;

  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function getSortingFilter(request: SortableRequest): {
  [key: string]:
    | 'asc'
    | 'desc'
    | {
        [key: string]: 'asc' | 'desc';
      };
} {
  if (!request.sort) {
    return {};
  }

  return {
    orderBy: {
      [request.sort]: request.order || SortOrder.ASC,
    },
  };
}
