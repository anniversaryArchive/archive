import { defineStore } from 'pinia';
import { query } from '@/composables/graphqlUtils';
import { FavoriteGroup } from '@/types/Favorite';
import getFavoritesGroup from '@/graphql/getFavoritesGroup.query.gql';

interface FavoriteState {
  favoriteGroups: FavoriteGroup[];
}

export const useFavoriteGroupStore = defineStore({
  id: 'favoriteGroup',
  state: (): FavoriteState => ({ favoriteGroups: [] }),
  getters: {
    total(): number { return this.data?.total || 0 },
  },
  actions: {
    getFavoriteGroupState() {
      query(getFavoritesGroup, {}, false).then(({ data }) => {
        this.favoriteGroups = data.value?.FavoriteGroupList || [];
      });
    }
  }
});