export interface ArtistParams {
    name        : string,
    debutDate   : string,
    birthDay    : string,
    group?      : string,
    image       : string,
    createdAt?  : string,
    updatedAt?  : string,
    color?      : string
}

const ArtistParamsType: { [key: string]: string } = {
    name        : 'string',
    debutDate   : 'string',
    birthDay    : 'string',
    group       : 'string',
    image       : 'string',
    createdAt   : 'string',
    updatedAt   : 'string',
    color       : 'string'
}

export {ArtistParamsType};