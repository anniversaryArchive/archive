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

interface ArchiveState {
  data?: WatchQuery;
}

export const useArchiveStore = defineStore({
  id: 'archive',
  state : (): ArchiveState => ({ data: undefined }),
  getters: {
    Archives(): Archive[] { return this.data?.list || [] },
    total (): number { return this.data?.total || 0 },
  },
  actions: {
    getArchives (pageData? : number | null, perPageData? : number | null, filterData? : object) {
      query(getArchives, {
        page: pageData,
        perPage : perPageData,
        filter: filterData
      }, false).then(({ data, error, execute }) => {
        this.data = {
          list: computed(() => {
            return data.value?.Archives.data || [];
          }),
          total: computed(() => { return data.value?.Archives?.total || 0; }),
          fetch: execute,
        };
      });
    },
  }
});
