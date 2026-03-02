import type { Referer, RefererData } from './types';
import refererData from './utils/latest-referers.json';

let allDomains = Object.entries(refererData as RefererData)
  .flatMap(([medium, mediumData]) =>
    Object.entries(mediumData).flatMap(([source, sourceData]) =>
      sourceData.domains.map((domain) => ({
        medium,
        referer: source,
        domain,
        parameters: sourceData.parameters,
      })),
    ),
  )
  .sort((a, b) => b.domain.length - a.domain.length);

export function parse(
  refererUrl: string | null,
  pageUrl?: string,
  internalDomains: string[] = [],
): Referer {
  if (!refererUrl) {
    return { medium: 'direct', referer: null, term: null };
  }

  let { refererParsed, pageParsed } = parseUrls(refererUrl, pageUrl);

  if (!refererParsed) {
    return { medium: 'invalid', referer: null, term: null };
  }

  if (isInternalReferral(refererParsed, pageParsed, internalDomains)) {
    return { medium: 'internal', referer: null, term: null };
  }

  let bestMatch = findBestMatch(refererParsed);

  return (
    bestMatch || {
      medium: 'unknown',
      referer: refererParsed.hostname,
      term: null,
    }
  );
}

function parseUrls(refererUrl: string, pageUrl?: string) {
  let refererParsed: URL | null = null;
  let pageParsed: URL | null = null;

  try {
    if (pageUrl && !refererUrl.startsWith('http')) {
      refererParsed = new URL(refererUrl, pageUrl);
    } else {
      refererParsed = new URL(refererUrl);
    }

    if (pageUrl) {
      pageParsed = new URL(pageUrl);
    }
  } catch (_e) {}

  return { refererParsed, pageParsed };
}

function isInternalReferral(refererParsed: URL, pageParsed: URL | null, internalDomains: string[]) {
  return (
    !!pageParsed &&
    (refererParsed.host === pageParsed.host || internalDomains.includes(refererParsed.host))
  );
}

function findBestMatch(refererParsed: URL): Referer | null {
  for (let { medium, referer, domain, parameters } of allDomains) {
    if (refererParsed.hostname.endsWith(domain)) {
      let term = findTerm(refererParsed, parameters);

      return { medium, referer, term };
    }
  }

  return null;
}

function findTerm(refererParsed: URL, parameters?: string[]): string | null {
  if (!parameters || parameters.length === 0) {
    return null;
  }

  return (
    parameters.map((param) => refererParsed.searchParams.get(param)).find((t) => t !== null) || null
  );
}

export type { Referer };
