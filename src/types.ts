export type Medium =
  | 'search'
  | 'social'
  | 'email'
  | 'video'
  | 'paid'
  | 'internal'
  | 'unknown'
  | 'invalid'
  | 'direct'
  | (string & {});

export interface Referer {
  medium: Medium;
  referer: string | null;
  term: string | null;
}

export interface RefererData {
  [medium: string]: {
    [source: string]: {
      domains: string[];
      parameters: string[];
    };
  };
}
