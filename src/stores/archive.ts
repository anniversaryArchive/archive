import { defineStore } from 'pinia';
import { CombinedError, BaseQueryApi } from 'villus';
import { WatchQuery } from '@/types/CommonTypes';
import { Archive } from '@/types/Archive'
import { Group } from '@/types/Group';
import { query, mutate } from '@/composables/graphqlUtils';
import { parsePaginationData } from './functions';

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
    setArchives(result: BaseQueryApi<any, object>) {
      this.data = parsePaginationData.call(this, 'archive', result);
    },
    setGroup(group: Group) {
      this.group = group;
    },
    getArchive(id: string) {
      return query(getArchive, { id }, false);
    },
    getArchives(args: {
      page?: number,
      perPage?: number,
      filter?: object,
      search?: searchDate,
      sortOrder?: number,
      sortField?: string,
    }) {
      const { page, perPage, filter, search, sortOrder, sortField } = args;

      query(getArchives, {
        page,
        perPage,
        filter,
        sortOrder,
        sortField,
        start: search?.start,
        end: search?.end,
      }, false).then(this.setArchives);
    },

    async createArchive(input: Record<string, any>): Promise<{ id?: string, error: CombinedError | null } | undefined> {
      try {
        const { data, error } = await mutate(createArchive, { input });
        const id: string | undefined = data?.archive?._id;
        if (id) { this.setArchives(await this.data?.fetch()); }
        return { id, error };
      } catch (error) { console.error(error); }
      return;
    },

    async updateArchive(id: string, input: Record<string, any>): Promise<boolean> {
      try {
        const { data } = await mutate(updateArchive, { id, input });
        const success: boolean = data?.success || false;
        if (success) { this.setArchives(await this.data?.fetch()); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },

    async removeArchive(id: string): Promise<boolean> {
      try {
        const { data } = await mutate(removeArchive, { id });
        const success: boolean = data?.success || false;
        if (success) { this.setArchives(await this.data?.fetch()); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },
  }
});
