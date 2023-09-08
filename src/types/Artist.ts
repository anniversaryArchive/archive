import { Image } from './Image';

export interface Artist {
    [key: string]: any;
    name: string,
    _id: string,
    debutDate: string,
    birthDay: string,
    group?: Record<string, any>;
    image?: Image | Blob,
    createdAt?: string,
    updatedAt?: string,
    color?: string
}

const ArtistType: { [key: string]: string } = {
    name: 'string',
    debutDate: 'string',
    birthDay: 'string',
    group: 'string',
    image: 'image',
    color: 'string'
}

export { ArtistType };