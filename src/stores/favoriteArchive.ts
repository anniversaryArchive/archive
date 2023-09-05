import { defineStore } from 'pinia';
import { BaseQueryApi } from 'villus';
import { query } from '@/composables/graphqlUtils';
import { FavoriteArchive } from '@/types/Favorite';
import getFavoriteArchives from '@/graphql/getFavoriteArchives.query.gql';
import { Variables, WatchQuery } from '@/types/CommonTypes';
import { parsePaginationData } from './functions';

interface FavoriteState {
  data?: WatchQuery<FavoriteArchive>;
}

interface searchDate {
  start?: string,
  end?: string
}

export const useFavoriteArchiveStore = defineStore({
  id: 'favoriteArchive',
  state: (): FavoriteState => ({ data: undefined }),
  getters: {
    favoriteArchives(): FavoriteArchive[] { return this.data?.list || [] },
    total(): number { return this.data?.total || 0 },
  },
  actions: {
    setFavoriteArchives(result: BaseQueryApi<any, object>) {
      this.data = parsePaginationData.call(this, 'FavoritePagination', result);
    },
    getFavoriteArchives(result: Variables, searchDate?: searchDate) {
      query(getFavoriteArchives, {
        page: result.page,
        perPage: result.perPage,
        group: result.group,
        start: searchDate?.start,
        end: searchDate?.end
      }, false).then(this.setFavoriteArchives);
    }
  }
});