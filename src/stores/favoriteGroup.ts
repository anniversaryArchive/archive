import { defineStore } from 'pinia';
import {query} from '@/composables/graphqlUtils';
import {computed} from 'vue';
import {FavoriteGroup} from '@/types/Favorite';
import getFavoritesGroup from '@/graphql/getFavoritesGroup.query.gql';
import {WatchQuery} from '@/types/CommonTypes';

interface FavoriteState {
  data?: WatchQuery<FavoriteGroup>;
}

export const useFavoriteGroupStore = defineStore({
  id: 'favoriteGroup',
  state: (): FavoriteState => ({ data: undefined }),
  getters: {
    favoriteGroups (): FavoriteGroup[] { return this.data?.list || [] },
    total (): number { return this.data?.total || 0 },
  },
  actions: {
    getFavoriteGroupState() {
      query(getFavoritesGroup, {}, false).then(({ data, error, execute }) => {
        this.data = {
          list: computed(() => {
            // 전달 데이터 확인 후 수정
            return data.value || [];
          }),
          // 전달 데이터 확인 후 수정
          total: computed(() => { return data.value || 0; }),
          fetch: execute,
        }
      });
    }
  }
});