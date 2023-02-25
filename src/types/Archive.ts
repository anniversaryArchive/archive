import {CommonSch} from '@/types/CommonTypes';

export interface Archive {
  _id         : string,
  address     : string,
  closeTime   : string,
  endDate     : string,
  images      : string,
  lat         : number,
  link        : string,
  lng         : number,
  mainImage   : string,
  name        : string,
  openTime    : string,
  organizer   : string,
  phoneNumber : string,
  startDate   : string,
  themeName   : string
}

export interface ArchiveSearchParams extends CommonSch {
  artist    : string;
  schBeginDe: string;
  schEndDe  : string;
}

const ArchiveType: { [key: string]: string } = {
  _id         : 'string',
  address     : 'string',
  closeTime   : 'string',
  endDate     : 'string',
  images      : 'string',
  lat         : 'number',
  link        : 'string',
  lng         : 'number',
  mainImage   : 'string',
  name        : 'string',
  openTime    : 'string',
  organizer   : 'string',
  phoneNumber : 'string',
  startDate   : 'string',
  themeName   : 'string'
}

export {ArchiveType};