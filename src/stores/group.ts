import { defineStore } from 'pinia';
import { BaseQueryApi } from 'villus';
import { Group } from '@/types/Group';
import { mutate, query } from '@/composables/graphqlUtils';
import { WatchQuery, ToSaveData } from '@/types/CommonTypes';
import { parsePaginationData } from './functions';

import getGroups from '@/graphql/getGroups.query.gql';
import removeGroup from '@/graphql/removeGroup.mutate.gql';
import createGroup from '@/graphql/createGroup.mutate.gql';
import updateGroup from '@/graphql/updateGroup.mutate.gql';


interface GroupState {
  data?: WatchQuery<Group>;
}

export const useGroupStore = defineStore({
  id: 'group',
  state: (): GroupState => ({ data: undefined }),
  getters: {
    groups(): Group[] { return this.data?.list || [] },
    total(): number { return this.data?.total || 0 },
  },
  actions: {
    setGroups(result: BaseQueryApi<any, object>) {
      this.data = parsePaginationData.call(this, 'groups', result);
    },

    getGroups() {
      query(getGroups, {}, false).then(this.setGroups);
    },
    getGroupsQuery(variables: Record<string, any> = {}) {
      return query(getGroups, variables);
    },

    async removeGroup(id: string): Promise<boolean> {
      try {
        const { data } = await mutate(removeGroup, { id });
        const success: boolean = data?.success || false;
        if (success) { this.setGroups(await this.data?.fetch()); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },

    async createGroup(saveData: ToSaveData): Promise<boolean> {
      try {
        const { data } = await mutate(createGroup, { saveData });
        const success: boolean = data?.createGroup._id || false;
        if (success) { this.setGroups(await this.data?.fetch()); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },

    async updateGroup(updateGroupId: unknown, saveData: ToSaveData): Promise<boolean> {
      try {
        const { data } = await mutate(updateGroup, { updateGroupId, saveData });
        const success: boolean = data?.updateGroup || false;
        if (success) { this.setGroups(await this.data?.fetch()); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },
  }
});
