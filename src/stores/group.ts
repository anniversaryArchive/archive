import { defineStore } from 'pinia';
import { QueryExecutionOpts, useQuery } from 'villus';
// @ts-ignore
import getGroups from '@/graphql/getGroups.query.gql';
import {Group} from '@/types/Group';

interface FetchFunc {
  (overrideOpts?: Partial<QueryExecutionOpts<any>>): Promise<any>
}

/*interface Group {
  _id: string;
  name: string;
}*/

interface GroupState {
  groups: Group[];
}

export const useGroupStore = defineStore({
  id: 'group',
  // state : (): GroupState => ({ groups: [] }),
  state: ():GroupState => {
    return {
      groups: [],
  }},
  getters: {},
  actions: {
    getGroups () {
      useQuery({ query: getGroups }).then(({ data }) => {
        this.groups = data.value?.groups || [];
      });
      return this. groups;
    },
    /*saveGroups(params : Group){
      return axios.get('', params);
    }*/
  }
});
