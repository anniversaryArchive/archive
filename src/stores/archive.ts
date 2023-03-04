import { defineStore } from 'pinia';
import { computed } from 'vue';
import { WatchQuery } from '@/types/CommonTypes';
import { Archive } from '@/types/Archive'
import { query, mutate } from '@/composables/graphqlUtils';
import { CombinedError } from 'villus';

// @ts-ignore
import getArchives from '@/graphql/getArchives.query.gql';
// @ts-ignore
import createArchive from '@/graphql/createArchive.mutate.gql';
// @ts-ignore
import patchArchive from '@/graphql/patchArchive.mutate.gql';
// @ts-ignore
import removeArchive from '@/graphql/removeArchive.mutate.gql';


interface ArchiveState {
  data?: WatchQuery<Archive>;
}

export const useArchiveStore = defineStore({
  id: 'archive',
  state: (): ArchiveState => ({ data: undefined }),
  getters: {
    archives (): Archive[] { return this.data?.list || [] },
    total (): number { return this.data?.total || 0 },
  },
  actions: {
    getArchives () {
      query(getArchives, {}, false).then(({ data, error, execute }) => {
        this.data = {
          list: computed(() => {
            return data.value?.archive?.data || [];
          }),
          total: computed(() => { return data.value?.archive?.total || 0; }),
          fetch: execute,
        };
      });
    },
    async createArchive (input: Record<string ,any>): Promise<{ id?: string, error: CombinedError | null } | undefined> {
      try {
        const { data, error } = await mutate(createArchive, { input });
        const id: string | undefined = data?.archive?._id;
        if (id) { this.data?.fetch(); }
        return { id, error };
      } catch (error) { console.error(error); }
      return;
    },

    async updateArchive (id: string, input: Record<string, any>): Promise<boolean> {
      try {
        const { data, error } = await mutate(patchArchive, { id, input });
        const success: boolean = data?.success || false;
        if (success) { this.data?.fetch(); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },

    async removeArchive (id: string): Promise<boolean> {
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