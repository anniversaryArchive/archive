import { defineStore } from 'pinia';
import { QueryExecutionOpts, useQuery } from 'villus';

import { query } from '@/composables/graphqlUtils';

// @ts-ignore
import getGroups from '@/graphql/getGroups.query.gql';
// @ts-ignore
import getGroupPagination from '@/graphql/getGroupPagination.query.gql';

interface FetchFunc {
  (overrideOpts?: Partial<QueryExecutionOpts<any>>): Promise<any>
}

interface Group {
  _id: string;
  name: string;
}

interface GroupState {
  groups: Group[];
}

export const useGroupStore = defineStore({
  id: 'group',
  state : (): GroupState => ({ groups: [] }),
  getters: {},
  actions: {
    getGroups () {
      useQuery({ query: getGroups }).then(({ data }) => {
        this.groups = data.value?.groups || [];
      });
    },
    getGroupQuery (variables: Record<string, any>) {
      return query(getGroupPagination, variables);
    },
  },
});
