export interface Group {
    name        : string,
    _id         : string,
    debutDate   : string,
    logo        : string,
    englishName? : string,
    createdAt?   : string,
    updatedAt?   : string,
    color?       : string
    artist?      : string
}

const GroupType: { [key: string]: string } = {
    name        : 'string',
    debutDate   : 'string',
    logo        : 'string',
    englishName : 'string',
    createdAt   : 'string',
    updatedAt   : 'string',
    color       : 'string'
}

export {GroupType};