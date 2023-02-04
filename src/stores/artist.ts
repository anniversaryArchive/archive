import { computed, ComputedRef } from 'vue';
import { defineStore } from 'pinia';
import { QueryExecutionOpts } from 'villus';
import { Artist } from '@/types/Artist';
import { query, mutate } from '@/composables/graphqlUntils';

// @ts-ignore
import getArtists from '@/graphql/getArtists.query.gql';
// @ts-ignore
import removeArtist from '@/graphql/removeArtist.mutate.gql';

interface FetchFunc {
  (overrideOpts?: Partial<QueryExecutionOpts<any>>): Promise<any>
}

interface WatchQuery {
  list: ComputedRef<Artist[]>;
  total: ComputedRef<number>;
  fetch: FetchFunc;
}

interface ArtistState {
  data?: WatchQuery;
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
      query(getArtists).then(({ data, error, execute }) => {
        this.data = {
          list: computed(() => {
            return data.value?.artist?.data || [];
          }),
          total: computed(() => { return data.value?.artist?.total || 0; }),
          fetch: execute,
        };
      });
    },

    removeArtist(id: string) {
      mutate(removeArtist, { id });
    },
  },
});
