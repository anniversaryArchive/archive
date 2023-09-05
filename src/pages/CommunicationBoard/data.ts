import moment from 'moment/moment';
import { CommunicationBoard } from '@/types/CommunicationBoard';
import { formatDate } from '@/composables/formatDate';

export const TABLE_COLUMNS: Record<string, any>[] = [
  {
    name: 'seq',
    required: true,
    label: '번호',
    align: 'center',
    field: (row: CommunicationBoard) => row.seq,
    format: (val: number) => `${val}`,
  }, {
    name: 'division',
    required: true,
    label: '분류',
    align: 'center',
    field: (row: CommunicationBoard) => DIVISION_LABEL[row.division],
    classes: (row: CommunicationBoard) => {
      let style = 'font-extrabold';
      if (row.fixed) { style += ' text-primary'; }
      return style;
    },
  }, {
    name: 'title',
    required: true,
    label: '제목',
    align: 'center',
    field: (row: CommunicationBoard) => row.title,
    classes: (row: CommunicationBoard) => {
      if (row.fixed) { return 'font-extrabold text-primary'; }
    },
  }, {
    name: 'createdAt',
    required: true,
    label: '날짜',
    align: 'center',
    field: (row: CommunicationBoard) => row.createdAt,
    format: (val: string) => formatDate(val, 'YYYY.MM.DD'),
  }, {
    name: 'author',
    required: true,
    label: '작성자',
    align: 'center',
    field: (row: CommunicationBoard) => row.author?.name,
  }
];

export const DIVISION_LABEL: Record<string, string> = {
  notice: '공지',
  group: '그룹 제안',
  artist: '아티스트 제안',
  // archive: '카페 제안',
  improvement: '기능 개선',
  error: '에러'
};

export interface Field {
  type: string;
  label: string;
  key: string;
  required: boolean;
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

export const DATA_FORM: Record<string, Field[]> = {
  group: GROUP_FROM,
  artist: ARTIST_FORM,
};
