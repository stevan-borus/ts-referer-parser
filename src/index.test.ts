import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parse } from './index';

const mockYaml = `
search:
  google:
    domains:
      - google.com
      - google.co.uk
    parameters:
      - q
      - query
  bing:
    domains:
      - bing.com
    parameters:
      - q
  yahoo:
    domains:
      - yahoo.com
    parameters:
      - p
social:
  facebook:
    domains:
      - facebook.com
      - fb.com
    parameters: []
  twitter:
    domains:
      - twitter.com
      - t.co
    parameters: []
  linkedin:
    domains:
      - linkedin.com
      - lnkd.in
    parameters: []
  instagram:
    domains:
      - instagram.com
    parameters: []
  pinterest:
    domains:
      - pinterest.com
    parameters: []
email:
  gmail:
    domains:
      - mail.google.com
    parameters: []
`;

beforeEach(() => {
  vi.resetAllMocks();

  global.fetch = vi.fn().mockResolvedValue({
    text: vi.fn().mockResolvedValue(mockYaml),
  }) as unknown as typeof fetch;
});

describe('parse function', () => {
  it('should return direct for empty referer', async () => {
    const result = await parse('');
    expect(result).toEqual({ medium: 'direct', referer: null, term: null });
  });

  it('should return invalid for invalid URLs', async () => {
    const result = await parse('not a url');
    expect(result).toEqual({ medium: 'invalid', referer: null, term: null });
  });

  it('should return internal for internal referers', async () => {
    const result = await parse('http://example.com/page', 'http://example.com');
    expect(result).toEqual({ medium: 'internal', referer: null, term: null });
  });

  it('should correctly parse Google search', async () => {
    const result = await parse('http://www.google.com/search?q=test');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: 'test',
    });
  });

  it('should correctly parse Google UK search', async () => {
    const result = await parse('http://www.google.co.uk/search?q=test');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: 'test',
    });
  });

  it('should correctly parse Bing search', async () => {
    const result = await parse('http://www.bing.com/search?q=test');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Bing',
      term: 'test',
    });
  });

  it('should correctly parse Yahoo search', async () => {
    const result = await parse('http://search.yahoo.com/search?p=test');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Yahoo!',
      term: 'test',
    });
  });

  it('should correctly parse Facebook referral', async () => {
    const result = await parse('http://www.facebook.com/page');
    expect(result).toEqual({
      medium: 'social',
      referer: 'Facebook',
      term: null,
    });
  });

  it('should correctly parse Twitter referral', async () => {
    const result = await parse('http://t.co/abcde');
    expect(result).toEqual({
      medium: 'social',
      referer: 'Twitter',
      term: null,
    });
  });

  it('should correctly parse LinkedIn referral', async () => {
    const result = await parse('http://www.linkedin.com/share');
    expect(result).toEqual({
      medium: 'social',
      referer: 'LinkedIn',
      term: null,
    });
  });

  it('should correctly parse LinkedIn short URL referral', async () => {
    const result = await parse('http://lnkd.in/abcde');
    expect(result).toEqual({
      medium: 'social',
      referer: 'LinkedIn',
      term: null,
    });
  });

  it('should correctly parse Instagram referral', async () => {
    const result = await parse('http://www.instagram.com/p/abcde');
    expect(result).toEqual({
      medium: 'social',
      referer: 'Instagram',
      term: null,
    });
  });

  it('should correctly parse Pinterest referral', async () => {
    const result = await parse('http://www.pinterest.com/pin/abcde');
    expect(result).toEqual({
      medium: 'social',
      referer: 'Pinterest',
      term: null,
    });
  });

  it('should correctly parse Gmail referral', async () => {
    const result = await parse('http://mail.google.com/mail/u/0');
    expect(result).toEqual({
      medium: 'email',
      referer: 'Gmail',
      term: null,
    });
  });

  it('should return unknown for unrecognized domains', async () => {
    const result = await parse('http://example.com');
    expect(result).toEqual({
      medium: 'unknown',
      referer: 'example.com',
      term: null,
    });
  });

  it('should handle URLs with no search terms', async () => {
    const result = await parse('http://www.google.com/');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: null,
    });
  });

  it('should handle URLs with empty search terms', async () => {
    const result = await parse('http://www.google.com/search?q=');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: null,
    });
  });

  it('should handle URLs with multiple search parameters', async () => {
    const result = await parse('http://www.google.com/search?q=test&hl=en');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: 'test',
    });
  });

  it('should handle internal domains', async () => {
    const result = await parse('http://subdomain.example.com', 'http://example.com', [
      'subdomain.example.com',
    ]);
    expect(result).toEqual({ medium: 'internal', referer: null, term: null });
  });

  it('should handle case-insensitive domain matching', async () => {
    const result = await parse('http://WWW.GOOGLE.COM/search?q=test');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: 'test',
    });
  });

  it('should handle URLs with ports', async () => {
    const result = await parse('http://www.google.com:8080/search?q=test');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: 'test',
    });
  });

  it('should handle URLs with username and password', async () => {
    const result = await parse('http://user:pass@www.google.com/search?q=test');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: 'test',
    });
  });

  it('should handle relative URLs when pageUrl is provided', async () => {
    const result = await parse('/path', 'http://www.example.com');
    expect(result).toEqual({ medium: 'internal', referer: null, term: null });
  });
});
