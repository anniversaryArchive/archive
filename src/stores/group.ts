import { defineStore } from 'pinia';
import { QueryExecutionOpts, useQuery } from 'villus';
import {Group} from '@/types/Group';
import {mutate, query} from '@/composables/graphqlUtils';
import {computed, ComputedRef} from 'vue';
import {ToSaveData} from '@/types/CommonTypes';

// @ts-ignore
import getGroups from '@/graphql/getGroups.query.gql';
// @ts-ignore
import removeGroup from '@/graphql/removeGroup.mutate.gql';
// @ts-ignore
import createGroup from '@/graphql/createGroup.mutate.gql';
// @ts-ignore
import updateGroup from '@/graphql/updateGroup.mutate.gql';


interface FetchFunc {
  (overrideOpts?: Partial<QueryExecutionOpts<any>>): Promise<any>
}

interface WatchQuery {
  list: Group[];
  total: ComputedRef<number>;
  fetch: FetchFunc;
}

interface GroupState {
  data?: WatchQuery;
}

export const useGroupStore = defineStore({
  id: 'group',
  state : (): GroupState => ({ data: undefined }),
  getters: {
    groups (): Group[] { return this.data?.list || [] },
    total (): number { return this.data?.total || 0 },
  },
  actions: {
    getGroups () {
      query(getGroups, {}, false).then(({ data, error, execute }) => {
        this.data = {
          list: computed(() => {
            return data.value?.groups?.data || [];
          }),
          total: computed(() => { return data.value?.groups?.total || 0; }),
          fetch: execute,
        };
      });
    },
    getGroupQuery (variables: Record<string, any>) {
      return query(getGroups, variables);
    },

    getGroupsQuery() {
      return new Promise((resolve, reject) => {
        useQuery({ query: getGroups }).then(({ data }) => {
          resolve(data.value);
        }).catch((error) => reject(error));
      });
    },

    async removeGroup(id: string): Promise<boolean> {
      try {
        const { data } = await mutate(removeGroup, { id });
        const success: boolean = data?.success || false;
        if (success) { this.data?.fetch(); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },

    async createGroup(saveData: ToSaveData): Promise<boolean> {
      try {
        const { data } = await mutate(createGroup, {saveData});
        const success: boolean = data?.createGroup._id || false;
        if (success) { this.data?.fetch(); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },

    async updateGroup(updateGroupId: unknown, saveData: ToSaveData): Promise<boolean> {
      try {
        const { data } = await mutate(updateGroup, {updateGroupId, saveData});
        const success: boolean = data?.updateGroup || false;
        if (success) { this.data?.fetch(); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },
  }
});
