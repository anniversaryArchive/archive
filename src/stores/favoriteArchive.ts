import { defineStore } from 'pinia';
import { BaseQueryApi } from 'villus';
import {mutate, query} from '@/composables/graphqlUtils';
import { FavoriteArchive } from '@/types/Favorite';
import getFavoriteArchives from '@/graphql/getFavoriteArchives.query.gql';
import { Variables, WatchQuery } from '@/types/CommonTypes';
import { parsePaginationData } from './functions';
import createFavorite from '@/graphql/createFavorite.mutate.gql';
import removeFavorite from '@/graphql/removeFavorite.mutate.gql';

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
    },
    async doCreateFavorite(_id: string): Promise<boolean> {
      try {
        const { data } = await mutate(createFavorite, { archive: _id });
        return !!data.favorite?._id;
      } catch (_) {}
      return false;
    },
    async doRemoveFavorite(_id: string): Promise<boolean> {
      try {
        const { data } = await mutate(removeFavorite, { archive: _id });
        return data.success && true;
      } catch (_) {}
      return false;
    }
  }
});
