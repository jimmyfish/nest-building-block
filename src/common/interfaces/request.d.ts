export interface RequestBody {
  headers?: any;
  user?: {
    id: string;
    name: string;
    username: string;
  };
  query?: {
    page: number;
    perPage: number;
    keyword?: string;
    groupBy?: string;
  };
}
