import { defineStore } from 'pinia';
import { QueryExecutionOpts, useQuery } from 'villus';
import { Artist } from '@/types/Artist';

// @ts-ignore
import getArtists from '@/graphql/getArtists.query.gql';

interface FetchFunc {
  (overrideOpts?: Partial<QueryExecutionOpts<any>>): Promise<any>
}

interface ArtistState {
  list: Artist[];
  total: number;
}

export const useArtistStore = defineStore({
  id: 'artist',
  state : (): ArtistState => ({ list: [], total: 0 }),
  getters: {
    artists (): Artist[] { return this.list },
  },
  actions: {
    getArtists () {
      useQuery({ query: getArtists }).then(({ data }) => {
        if (!data.value?.artist) { return; }
        this.list = data.value.artist.data || [];
        this.total = data.value.artist.total || 0;
      });
    },
  },
});
