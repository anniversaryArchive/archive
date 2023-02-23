export interface Artist {
    name        : string,
    _id         : string,
    debutDate   : string,
    birthDay    : string,
    group?      : string,
    image       : string,
    createdAt?  : string,
    updatedAt?  : string,
    color?      : string
}

const ArtistType: { [key: string]: string } = {
    name        : 'string',
    debutDate   : 'string',
    birthDay    : 'string',
    group       : 'string',
    image       : 'image',
    color       : 'string'
}

export {ArtistType};