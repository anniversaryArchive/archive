import { defineStore } from 'pinia';
import { QueryExecutionOpts } from 'villus';
import {Group} from '@/types/Group';
import {mutate, query} from '@/composables/graphqlUtils';
import {computed, ComputedRef} from 'vue';

// @ts-ignore
import getGroups from '@/graphql/getGroups.query.gql';
// @ts-ignore
import removeGroup from '@/graphql/removeGroup.mutate.gql';

// @ts-ignore
import createGroup from '@/graphql/createGroup.mutate.gql';
import {ToSaveData} from '@/types/CommonTypes';

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
    /*getGroups () {
      useQuery({ query: getGroups }).then(({ data }) => {
        this.groups = data.value?.groups || [];
      });
      return this. groups;
    },*/

    getGroups () {
      query(getGroups, {}, false).then(({ data, error, execute }) => {
        this.data = {
          list: computed(() => {
            return data.value?.groups?.data || [];
          }),
          total: computed(() => { return data.value?.artist?.total || 0; }),
          fetch: execute,
        };
      });
    },

    async removeGroup(id: string): Promise<boolean> {
      try {
        const { data, error } = await mutate(removeGroup, { id });
        const success: boolean = data?.success || false;
        if (success) { this.data?.fetch(); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },

    async createGroup(saveData: ToSaveData): Promise<boolean> {
      try {
        const { data, error } = await mutate(createGroup, {saveData});
        const success: boolean = data?.success || false;
        if (success) { this.data?.fetch(); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },
  }
});
