import { BaseQueryApi } from 'villus';
import { WatchQuery } from '@/types/CommonTypes';

export function parsePaginationData<T>(type: string, { data, execute }: BaseQueryApi<any, object>): WatchQuery<T> | undefined {
  arguments
  data = data.value || data;
  if (!data) { return data; }
  const result = (data as Record<string, any>)[type] || {};
  return {
    list: result.data || [],
    total: result.total || 0,
    fetch: execute || this.data.fetch,
  };
}