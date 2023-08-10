import {Archive} from '@/types/Archive';

export interface Favorite {
    user        : string, // 즐겨찾기한 유저
    group       : string, // 즐겨찾기한 카페 그룹
    archive     : string, // 즐겨찾기한 카페
    createdAt   : string, // 생성 일자
    updatedAt   : string  // 마지막 업데이트 일자
}

export interface FavoriteGroup {
    _id         : string,
    name        : string,
}

export interface FavoriteArchive {
    _id         : string,
    archive     : [Archive]
}

const FavoriteType: { [key: string]: string } = {
    user        : 'string',
    group       : 'string',
    archive     : 'string',
    createdAt   : 'string',
    updatedAt   : 'string',
}

export {FavoriteType};