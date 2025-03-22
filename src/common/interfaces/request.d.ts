import { User } from './user';

export interface RequestBody {
  headers?: any;
  user?: User;
  query?: {
    page: number;
    perPage: number;
    keyword?: string;
    groupBy?: string;
  };
}
