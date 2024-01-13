import { Archive } from '@/types/Archive';

export interface FavoriteGroup {
  _id: string;
  title: string;
  color?: string;
  archives: Archive[];
  selected?: boolean;
}
