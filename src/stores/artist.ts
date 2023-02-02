import { defineStore } from 'pinia';
import { QueryExecutionOpts, useQuery } from 'villus';
// @ts-ignore
import getArtists from '@/graphql/getArtists.query.gql';

interface FetchFunc {
    (overrideOpts?: Partial<QueryExecutionOpts<any>>): Promise<any>
}

interface Artist {
    _id: string;
    name: string;
}

interface ArtistState {
    artists: Artist[];
}

export const useArtistStore = defineStore({
    id: 'artist',
    state: ():ArtistState => {
        return {
            artists: [],
        }},
    getters: {},
    actions: {
        getArtists () {
            useQuery({ query: getArtists }).then(({ data }) => {
                this.artists = data.value?.artists || [];
            });
            return this. artists;
        }
    }
});
