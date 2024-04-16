export type PlacesResponse = {
  results: PlacesResult[];
  total: number;
  lastResult: PlacesResult;
};

export type PlacesResult = {
  id: string;
  name: string;
  tables: number[];
};

export type ReserveResponse = {
  id: string;
};
