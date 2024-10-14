import type refererData from './utils/latest-referers.json';

type RefererCategories = keyof typeof refererData;
type RefererSources = {
  [K in RefererCategories]: keyof (typeof refererData)[K];
}[RefererCategories];

export type RefererCategory =
  | RefererCategories
  | 'unknown'
  | 'internal'
  | 'invalid'
  | 'direct'
  | (string & {});

export type RefererSource = RefererSources | (string & {});

export type Referer = {
  medium: RefererCategory;
  referer: RefererSource | null;
  term: string | null;
};

export interface RefererData {
  [medium: string]: {
    [source: string]: {
      domains: string[];
      parameters?: string[];
    };
  };
}
