export const DIVISION_LABEL: Record<string, string> = {
  notice: '공지',
  group: '그룹 제안',
  artist: '아티스트 제안',
  archive: '카페 제안',
  improvement: '기능 개선',
  error: '에러'
};

const GROUP_FROM: Record<string, any>[] = [
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

export const DATA_FORM: Record<string, any> = {
  group: GROUP_FROM,
};