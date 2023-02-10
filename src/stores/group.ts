import { defineStore } from 'pinia';
import { QueryExecutionOpts, useQuery } from 'villus';

// @ts-ignore
import getGroups from '@/graphql/getGroups.query.gql';

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

    // TODO: 함수명 변경 !!!
    getGroupsTest() {
      return new Promise((resolve, reject) => {
        useQuery({ query: getGroups }).then(({ data }) => {
          resolve(data.value);
        }).catch((error) => reject(error));
      });
    }
  },
});
