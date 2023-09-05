import moment from 'moment';

export function formatDate(value: string, format: string = 'YYYY-MM-DD HH:mm:ss') {
  if (!value) { return ''; }
  return moment(new Date(value)).format(format);
}