import { defineStore } from 'pinia';
import { Archive } from '@/types/Archive';

interface MapState {
  markerData: Archive[];
  selectedArchive?: Archive | null;
}

export const useMapStore = defineStore({
  id: 'map',
  state: (): MapState => ({ markerData: [] }),
  actions: {
    setMarkerData(archives: Archive[]) {
      this.markerData = archives;
    },
    setSelectedArchive(archive: Archive | null | undefined) {
      this.selectedArchive = archive;
    },
  },
});
