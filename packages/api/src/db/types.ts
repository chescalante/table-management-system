export type PaginatedResults<T> = {
  results: T[];
  lastResult?: T;
  total: number;
};
