export interface GroupParams {
    name        : string,
    debutDate   : string,
    logo        : string,
    englishName? : string,
    createdAt?   : string,
    updatedAt?   : string,
    color?       : string
    artist?      : string
}

const GroupParamsType: { [key: string]: string } = {
    name        : 'string',
    debutDate   : 'string',
    logo        : 'string',
    englishName : 'string',
    createdAt   : 'string',
    updatedAt   : 'string',
    color       : 'string'
}

export {GroupParamsType};