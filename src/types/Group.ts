import { Artist } from '@/types/Artist';
import { Image } from './Image';

export interface Group {
    name: string,
    _id: string,
    debutDate: string,
    logo?: Image | undefined, // Blob,
    englishName?: string,
    createdAt?: string,
    updatedAt?: string,
    color?: string
    artists?: [Artist] | null,
}

const GroupType: { [key: string]: string } = {
    name: 'string',
    debutDate: 'string',
    logo: 'string',
    englishName: 'string',
    createdAt: 'string',
    updatedAt: 'string',
    color: 'string'
}

export { GroupType };
