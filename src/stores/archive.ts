import { defineStore } from 'pinia';
import { computed } from 'vue';
import { WatchQuery } from '@/types/CommonTypes';
import { Archive } from '@/types/Archive'
import { Group } from '@/types/Group';
import { query, mutate } from '@/composables/graphqlUtils';
import { CombinedError } from 'villus';

import getArchive from '@/graphql/getArchive.query.gql';
import getArchives from '@/graphql/getArchives.query.gql';
import createArchive from '@/graphql/createArchive.mutate.gql';
import updateArchive from '@/graphql/updateArchive.mutate.gql';
import removeArchive from '@/graphql/removeArchive.mutate.gql';

interface ArchiveState {
  data?: WatchQuery<Archive>;
  group?: Group;
}

interface searchDate {
  start?: string,
  end?: string
}

export const useArchiveStore = defineStore({
  id: 'archive',
  persist: true,
  state: (): ArchiveState => ({
    data: undefined,
    group: undefined,
  }),
  getters: {
    archives(): Archive[] { return this.data?.list || [] },
    total(): number { return this.data?.total || 0 },
    groupId(): string | undefined { return this.group?._id },
  },
  actions: {
    setGroup(group: Group) {
      this.group = group;
    },
    getArchive(id: string) {
      return query(getArchive, { id }, false);
    },
    getArchives(pageData?: number | null, perPageData?: number | null, filterData?: object, searchDate?: searchDate) {
      query(getArchives, {
        page: pageData,
        perPage: perPageData,
        filter: filterData,
        start: searchDate?.start,
        end: searchDate?.end
      }, false).then(({ data, error, execute }) => {
        this.data = {
          list: computed(() => {
            return data.value?.archive?.data || [];
          }),
          total: computed(() => { return data.value?.archive?.total || 0; }),
          fetch: execute,
        };
      });
    },

    async createArchive(input: Record<string, any>): Promise<{ id?: string, error: CombinedError | null } | undefined> {
      try {
        const { data, error } = await mutate(createArchive, { input });
        const id: string | undefined = data?.archive?._id;
        if (id) { this.data?.fetch(); }
        return { id, error };
      } catch (error) { console.error(error); }
      return;
    },

    async updateArchive(id: string, input: Record<string, any>): Promise<boolean> {
      try {
        const { data, error } = await mutate(updateArchive, { id, input });
        const success: boolean = data?.success || false;
        if (success) { this.data?.fetch(); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },

    async removeArchive(id: string): Promise<boolean> {
      try {
        const { data, error } = await mutate(removeArchive, { id });
        const success: boolean = data?.success || false;
        if (success) { this.data?.fetch(); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },
  }
});
