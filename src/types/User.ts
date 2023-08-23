export interface User {
  _id: string;
  name: string;
  email: string;
  provider: string;
  providerId: string;
  image?: string;
  role: 'user' | 'admin';
}
