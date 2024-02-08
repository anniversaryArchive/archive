import { defineStore } from 'pinia';
import { query, mutate } from '@/composables/graphqlUtils';
import { FavoriteGroup } from '@/types/FavoriteGroup';
import getFavoriteGroupList from '@/graphql/getFavoriteGroupList.query.gql';
import createFavoriteGroup from '@/graphql/createFavoriteGroup.mutate.gql';
import updateFavoriteGroupsInArchive from '@/graphql/updateFavoriteGroupsInArchive.mutate.gql';

interface FavoriteGroupState {
  favoriteGroupList: FavoriteGroup[];
}

export const useFavoriteGroupStore = defineStore({
  id: 'favoriteGroup',
  state: (): FavoriteGroupState => ({ favoriteGroupList: [] }),
  getters: {
    list(): FavoriteGroup[] {
      return this.favoriteGroupList;
    },
  },
  actions: {
    getFavoriteGroupList(filterData?: object) {
      query(getFavoriteGroupList, { filter: filterData }, false).then(({ data }) => {
        this.favoriteGroupList = data.value.favoriteGroup || [];
      });
    },
    async createFavoriteGroup(input: Record<string, any>): Promise<string | undefined> {
      try {
        const { data } = await mutate(createFavoriteGroup, { input });
        const id: string | undefined = data?.favoriteGroup?._id;
        if (id) {
          this.favoriteGroupList.push(data.favoriteGroup);
        }
        return id;
      } catch (_) {
        return;
      }
    },
    async updateFavoriteGroupsInArchive(archive: string, favoriteGroups: string[]) {
      try {
        const { data } = await mutate(updateFavoriteGroupsInArchive, {
          archive,
          favoriteGroups,
        });
        return data?.favoriteGroups || [];
      } catch (error) {
        console.error('[ERROR] update favorite groups in archive : ', error);
      }
    },
  },
});
