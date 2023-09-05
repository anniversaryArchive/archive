import { defineStore } from 'pinia';
import { BaseQueryApi } from 'villus';
import { Artist } from '@/types/Artist';
import { WatchQuery } from '@/types/CommonTypes';
import { query, mutate } from '@/composables/graphqlUtils';
import { parsePaginationData } from './functions';

import getArtists from '@/graphql/getArtists.query.gql';
import createArtist from '@/graphql/createArtist.mutate.gql';
import patchArtist from '@/graphql/patchArtist.mutate.gql';
import removeArtist from '@/graphql/removeArtist.mutate.gql';

interface ArtistState {
  data?: WatchQuery<Artist>;
}

export const useArtistStore = defineStore({
  id: 'artist',
  state: (): ArtistState => ({ data: undefined }),
  getters: {
    artists(): Artist[] { return this.data?.list || [] },
    total(): number { return this.data?.total || 0 },
  },
  actions: {
    setArtists(result: BaseQueryApi<any, object>) {
      this.data = parsePaginationData.call(this, 'artist', result);
    },
    getArtists(filterData?: object) {
      query(getArtists, { filter: filterData }, false).then(this.setArtists);
    },

    getArtistsQuery(variables: Record<string, any> = {}) {
      return query(getArtists, variables, false);
    },

    async createArtist(input: Record<string, any>): Promise<string | undefined> {
      try {
        const { data } = await mutate(createArtist, { input });
        const id: string | undefined = data?.artist?._id;
        if (id) { this.setArtists(await this.data?.fetch()); }
        return id;
      } catch (_) { return; }
    },

    async updateArtist(id: string, input: Record<string, any>): Promise<boolean> {
      try {
        const { data } = await mutate(patchArtist, { id, input });
        const success: boolean = data?.success || false;
        if (success) { this.setArtists(await this.data?.fetch()); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },

    async removeArtist(id: string): Promise<boolean> {
      try {
        const { data } = await mutate(removeArtist, { id });
        const success: boolean = data?.success || false;
        if (success) { this.setArtists(await this.data?.fetch()); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },
  },
});
