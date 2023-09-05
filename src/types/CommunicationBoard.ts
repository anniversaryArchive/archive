import { User } from './User';

export type CommunicationBoardDivision = 'notice' | 'group' | 'artist' | 'archive' | 'improvement' | 'error';

export interface CommunicationBoard {
  [key: string]: any;
  _id: string;
  seq: number;
  createdAt: Date;
  updatedAt: Date;
  division: 'notice' | 'group' | 'artist' | 'archive' | 'improvement' | 'error';
  title: string;
  content?: string;
  author: User;
  data?: Record<string, any>;
  fixed: boolean;
  status: 'none' | 'request' | 'accept' | 'reject';
  message?: string;
}
