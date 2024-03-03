import { QTableProps } from 'quasar';
import { CommunicationBoardDivision } from '@/types/CommunicationBoard';
import { formatDate } from '@/composables/formatDate';

export const TABLE_COLUMNS: QTableProps['columns'] = [
  {
    name: 'seq',
    required: true,
    label: '번호',
    align: 'center',
    field: (row: any) => row.seq,
    format: (val: any) => `${val}`,
  },
  {
    name: 'division',
    required: true,
    label: '분류',
    align: 'center',
    field: (row: any) => DIVISION_LABEL[row.division as CommunicationBoardDivision],
    classes: (row: any) => {
      let style = 'font-extrabold';
      if (row.fixed) {
        style += ' text-primary';
      }
      return style;
    },
  },
  {
    name: 'title',
    required: true,
    label: '제목',
    align: 'center',
    field: (row: any) => row.title,
    classes: (row: any) => {
      if (row.fixed) {
        return 'font-extrabold text-primary';
      }
      return '';
    },
  },
  {
    name: 'createdAt',
    required: true,
    label: '날짜',
    align: 'center',
    field: (row: any) => row.createdAt,
    format: (val: string) => formatDate(val, 'YYYY.MM.DD'),
  },
  {
    name: 'author',
    required: true,
    label: '작성자',
    align: 'center',
    field: (row: any) => row.author?.name,
  },
  {
    name: 'status',
    required: false,
    label: '상태',
    align: 'center',
    field: (row: any) => STATUS_LABEL[row.status] || '-',
  },
];

export const DIVISION_LABEL: Record<CommunicationBoardDivision, string> = {
  notice: '공지',
  group: '그룹 제안',
  artist: '아티스트 제안',
  archive: '카페 제안',
  improvement: '기능 개선',
  error: '에러',
};

export const DIVISION_OPTIONS: CommunicationBoardDivision[] = Object.keys(
  DIVISION_LABEL,
) as CommunicationBoardDivision[];

export const STATUS_LABEL: Record<string, string> = {
  none: '',
  request: '제안',
  accept: '승인',
  reject: '거절',
};

export interface Field {
  type: string;
  label: string;
  key: string;
  required: boolean;
  parent?: string;
  objectFields?: Field[];
}

const GROUP_FROM: Field[] = [
  { label: '그룹명(한글)', key: 'name', required: true, type: 'text' },
  { label: '그룹명(영어)', key: 'englishName', required: false, type: 'text' },
  { label: '데뷔 일자', key: 'debutDate', required: true, type: 'date' },
  { label: '로고', key: 'logo', required: true, type: 'image' },
  { label: '대표 색상', key: 'color', required: false, type: 'color' },
  {
    label: '소속 아티스트',
    key: 'newArtists',
    required: false,
    type: 'objectList',
    objectFields: [
      { label: '아티스트 이름', key: 'name', required: true, type: 'text' },
      { label: '생일', key: 'birthDay', required: true, type: 'date' },
    ],
  },
];

const ARTIST_FORM: Field[] = [
  { label: '이름', key: 'name', required: true, type: 'text' },
  { label: '생일', key: 'birthDay', required: true, type: 'date' },
  { label: '그룹', key: 'group', required: true, type: 'select' },
];

const ARCHIVE_FORM: Field[] = [
  { label: '그룹', key: 'group', required: true, type: 'select' },
  { label: '아티스트', key: 'artist', required: false, type: 'select', parent: 'group' },
  { label: '카페 테마 이름', key: 'themeName', required: true, type: 'text' },
  { label: '카페 이름', key: 'name', required: true, type: 'text' },
  { label: '시도', key: 'districtName', type: 'text', required: false },
  { label: '주소', key: 'address', required: true, type: 'address' },
  { label: '상세 주소', key: 'detailAddress', required: false, type: 'text', parent: 'address' },
  { label: '주최자 (트위터 ID)', key: 'organizer', required: true, type: 'text' },
  { label: '시작일', key: 'startDate', required: true, type: 'date' },
  { label: '종료일', key: 'endDate', required: true, type: 'date' },
  // { label: '오픈 시간', key: 'openTime', required: false, type: 'time' },
  // { label: '종료 시간', key: 'closeTime', required: false, type: 'time' },
  { label: '메인 이미지', key: 'mainImage', required: true, type: 'image' },
  { label: '서브 이미지들', key: 'images', required: false, type: 'images' },
  { label: '번호', key: 'phoneNumber', required: false, type: 'text' },
  { label: '링크', key: 'link', required: false, type: 'url' },
];

export const DATA_FORM: Record<string, Field[]> = {
  group: GROUP_FROM,
  artist: ARTIST_FORM,
  archive: ARCHIVE_FORM,
};
