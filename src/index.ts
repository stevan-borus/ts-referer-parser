import type { Referer, RefererData } from './types';
import refererData from './utils/latest-referers.json';

type Rule = { medium: string; referer: string; parameters?: string[] };
type HostRules = { hostRule?: Rule; pathRules: { path: string; rule: Rule }[] };

let rulesByHost = new Map<string, HostRules>();

for (let [medium, mediumData] of Object.entries(refererData as RefererData)) {
  for (let [referer, { domains, parameters }] of Object.entries(mediumData)) {
    for (let domain of domains) {
      let slash = domain.indexOf('/');
      let host = normalizeHost(slash === -1 ? domain : domain.slice(0, slash));
      let path = slash === -1 ? '' : domain.slice(slash).replace(/\/$/, '');
      let rule = { medium, referer, parameters };
      let entry = rulesByHost.get(host) ?? { pathRules: [] };

      if (path) {
        entry.pathRules.push({ path, rule });
      } else {
        entry.hostRule ??= rule;
      }
      rulesByHost.set(host, entry);
    }
  }
}

for (let entry of rulesByHost.values()) {
  entry.pathRules.sort((a, b) => b.path.length - a.path.length);
}

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
  let labels = normalizeHost(refererParsed.hostname).split('.');

  for (let i = 0; i < labels.length; i++) {
    let entry = rulesByHost.get(labels.slice(i).join('.'));
    let rule =
      entry?.pathRules.find(({ path }) => matchesPath(refererParsed.pathname, path))?.rule ??
      entry?.hostRule;

    if (rule) {
      return {
        medium: rule.medium,
        referer: rule.referer,
        term: findTerm(refererParsed, rule.parameters),
      };
    }
  }

  return null;
}

function normalizeHost(host: string) {
  return host.toLowerCase().replace(/\.$/, '');
}

function matchesPath(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
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
