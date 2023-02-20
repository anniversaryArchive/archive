import { defineStore } from 'pinia';
import { QueryExecutionOpts } from 'villus';
import {Archive} from '@/types/Archive';
import {query} from '@/composables/graphqlUtils';
import {computed, ComputedRef} from 'vue';

// @ts-ignore
import getArchives from '@/graphql/getArchives.query.gql';


interface FetchFunc {
  (overrideOpts?: Partial<QueryExecutionOpts<any>>): Promise<any>
}

interface WatchQuery {
  list: Archive[];
  total: ComputedRef<number>;
  fetch: FetchFunc;
}

interface GroupState {
  data?: WatchQuery;
}

export const useArchiveStore = defineStore({
  id: 'archive',
  state : (): GroupState => ({ data: undefined }),
  getters: {
    groups (): Archive[] { return this.data?.list || [] },
    total (): number { return this.data?.total || 0 },
  },
  actions: {
    getArchives () {
      query(getArchives, {}, false).then(({ data, error, execute }) => {
        this.data = {
          list: computed(() => {
            return data.value?.archive?.data || [];
          }),
          total: computed(() => { return data.value?.groups?.total || 0; }),
          fetch: execute,
        };
      });
    },
  }
});
