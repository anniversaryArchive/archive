import { defineStore } from 'pinia';
import {query} from '@/composables/graphqlUtils';
import {QueryExecutionOpts} from 'villus';
import {computed, ComputedRef} from 'vue';
import {FavoriteArchive, FavoriteGroup} from '@/types/Favorite';
import getFavoriteArchives from '@/graphql/getFavoriteArchives.query.gql';
import { variables} from '@/types/CommonTypes';

interface FetchFunc {
  (overrideOpts?: Partial<QueryExecutionOpts<any>>): Promise<any>
}

interface WatchQuery {
  list: FavoriteArchive[];
  total: ComputedRef<number>;
  fetch: FetchFunc;
}

interface FavoriteState {
  data?: WatchQuery;
}

interface searchDate {
  start?: string,
  end?: string
}

export const useFavoriteArchiveStore = defineStore({
  id: 'favoriteArchive',
  state: (): FavoriteState => ({ data: undefined }),
  getters: {
    favoriteArchives (): FavoriteArchive[] { return this.data?.list || [] },
    total (): number { return this.data?.total || 0 },
  },
  actions: {
    getFavoriteArchives(result: variables, searchDate?: searchDate) {
      query(getFavoriteArchives, {
        page: result.page,
        perPage : result.perPage,
        group: result.group,
        start: searchDate?.start,
        end: searchDate?.end
      }, false).then(({ data, error, execute }) => {
        this.data = {
          list: computed(() => {
            return data.value?.FavoritePagination?.data || [];
          }),
          total: computed(() => { return data.value?.FavoritePagination?.data || 0; }),
          fetch: execute,
        };
      });
    }
  }
});