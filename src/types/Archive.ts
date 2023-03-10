import { Image } from './Image';

export interface Archive {
  name: string;           // 카페 이름
  themeName: string;      // 카페 테마 명
  address: string;        // 주소
  detailAddress?: string; // 상세 주소
  lat: number;            // 위도
  lng: number;            // 경도
  organizer: string;      // 주최자
  startDate: Date;        // 시작일
  endDate: Date;          // 종료일
  openTime?: Date;        // 영업 시작 시간
  closeTime?: Date;       // 영업 종료 시간
  mainImage: Image;       // 메인 이미지
  images: [Image];        // 이미지 리스트
  phoneNumber?: string;   // 전화번호
  link?: string;          // 대표 링크
}

export const ArchiveType: Record<string, string> = {
  name: 'string',
  themeName: 'string',
  address: 'string',
  detailAddress: 'string',
  lat: 'number',
  lng: 'number',
  organizer: 'string',
  startDate: 'string',
  endDate: 'string',
  openTime: 'undefined',
  closeTime: 'undefined',
  mainImage: 'image',
  images: '[]',
  phoneNumber: 'string',
  link: 'string'
}
