export interface Image {
  [key: string]: any;
  _id?: string;
  name: string;
  path: string;
  file?: Blob;
}
