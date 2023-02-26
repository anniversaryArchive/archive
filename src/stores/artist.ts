import { computed } from 'vue';
import { defineStore } from 'pinia';
import { Artist } from '@/types/Artist';
import { WatchQuery } from '@/types/CommonTypes';
import { query, mutate } from '@/composables/graphqlUtils';

// @ts-ignore
import getArtists from '@/graphql/getArtists.query.gql';
// @ts-ignore
import createArtist from '@/graphql/createArtist.mutate.gql';
// @ts-ignore
import patchArtist from '@/graphql/patchArtist.mutate.gql';
// @ts-ignore
import removeArtist from '@/graphql/removeArtist.mutate.gql';

interface ArtistState {
  data?: WatchQuery<Artist>;
}

export const useArtistStore = defineStore({
  id: 'artist',
  state : (): ArtistState => ({ data: undefined }),
  getters: {
    artists (): Artist[] { return this.data?.list || [] },
    total (): number { return this.data?.total || 0 },
  },
  actions: {
    getArtists () {
      query(getArtists, {}, false).then(({ data, error, execute }) => {
        this.data = {
          list: computed(() => {
            return data.value?.artist?.data || [];
          }),
          total: computed(() => { return data.value?.artist?.total || 0; }),
          fetch: execute,
        };
      });
    },

    getArtistsQuery (variables: Record<string, any> = {}) {
      return query(getArtists, variables, false);
    },

    async createArtist(input: Record<string, any>): Promise<string | undefined> {
      try {
        const { data, error } = await mutate(createArtist, { input });
        const id: string | undefined = data?.artist?._id;
        if (id) { this.data?.fetch(); }
        return id;
      } catch (_) { return; }
    },

    async updateArtist(id: string, input: Record<string, any>): Promise<boolean> {
      try {
        const { data, error } = await mutate(patchArtist, { id, input });
        const success: boolean = data?.success || false;
        if (success) { this.data?.fetch(); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },

    async removeArtist(id: string): Promise<boolean> {
      try {
        const { data, error } = await mutate(removeArtist, { id });
        const success: boolean = data?.success || false;
        if (success) { this.data?.fetch(); }
        return success;
      } catch (error) { console.error(error); }
      return false;
    },
  },
});
