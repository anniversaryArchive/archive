import { User } from './User';

export interface CommunicationBoard {
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
