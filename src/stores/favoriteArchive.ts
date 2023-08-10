import { defineStore } from 'pinia';
import {query} from '@/composables/graphqlUtils';
import {computed} from 'vue';
import {FavoriteArchive} from '@/types/Favorite';
import getFavoriteArchives from '@/graphql/getFavoriteArchives.query.gql';
import {Variables, WatchQuery} from '@/types/CommonTypes';

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
    favoriteArchives (): FavoriteArchive[] { return this.data?.list || [] },
    total (): number { return this.data?.total || 0 },
  },
  actions: {
    getFavoriteArchives(result: Variables, searchDate?: searchDate) {
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