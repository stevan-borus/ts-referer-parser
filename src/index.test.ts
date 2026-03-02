import { describe, expect, it } from 'vitest';
import { parse } from './index';

describe('parse function', () => {
  it('should return direct for empty referer', () => {
    let result = parse('');
    expect(result).toEqual({ medium: 'direct', referer: null, term: null });
  });

  it('should return invalid for invalid URLs', () => {
    let result = parse('not a url');
    expect(result).toEqual({ medium: 'invalid', referer: null, term: null });
  });

  it('should return internal for internal referers', () => {
    let result = parse('http://example.com/page', 'http://example.com');
    expect(result).toEqual({ medium: 'internal', referer: null, term: null });
  });

  it('should correctly parse Google search', () => {
    let result = parse('http://www.google.com/search?q=test');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: 'test',
    });
  });

  it('should correctly parse Google UK search', () => {
    let result = parse('http://www.google.co.uk/search?q=test');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: 'test',
    });
  });

  it('should correctly parse Bing search', () => {
    let result = parse('http://www.bing.com/search?q=test');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Bing',
      term: 'test',
    });
  });

  it('should correctly parse Yahoo search', () => {
    let result = parse('http://search.yahoo.com/search?p=test');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Yahoo!',
      term: 'test',
    });
  });

  it('should correctly parse Facebook referral', () => {
    let result = parse('http://www.facebook.com/page');
    expect(result).toEqual({
      medium: 'social',
      referer: 'Facebook',
      term: null,
    });
  });

  it('should correctly parse Twitter referral', () => {
    let result = parse('http://t.co/abcde');
    expect(result).toEqual({
      medium: 'social',
      referer: 'Twitter',
      term: null,
    });
  });

  it('should correctly parse LinkedIn referral', () => {
    let result = parse('http://www.linkedin.com/share');
    expect(result).toEqual({
      medium: 'social',
      referer: 'LinkedIn',
      term: null,
    });
  });

  it('should correctly parse LinkedIn short URL referral', () => {
    let result = parse('http://lnkd.in/abcde');
    expect(result).toEqual({
      medium: 'social',
      referer: 'LinkedIn',
      term: null,
    });
  });

  it('should correctly parse Instagram referral', () => {
    let result = parse('http://www.instagram.com/p/abcde');
    expect(result).toEqual({
      medium: 'social',
      referer: 'Instagram',
      term: null,
    });
  });

  it('should correctly parse Pinterest referral', () => {
    let result = parse('http://www.pinterest.com/pin/abcde');
    expect(result).toEqual({
      medium: 'social',
      referer: 'Pinterest',
      term: null,
    });
  });

  it('should correctly parse Gmail referral', () => {
    let result = parse('http://mail.google.com/mail/u/0');
    expect(result).toEqual({
      medium: 'email',
      referer: 'Gmail',
      term: null,
    });
  });

  it('should return unknown for unrecognized domains', () => {
    let result = parse('http://example.com');
    expect(result).toEqual({
      medium: 'unknown',
      referer: 'example.com',
      term: null,
    });
  });

  it('should handle URLs with no search terms', () => {
    let result = parse('http://www.google.com/');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: null,
    });
  });

  it('should handle URLs with empty search terms', () => {
    let result = parse('http://www.google.com/search?q=');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: null,
    });
  });

  it('should handle URLs with multiple search parameters', () => {
    let result = parse('http://www.google.com/search?q=test&hl=en');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: 'test',
    });
  });

  it('should handle internal domains', () => {
    let result = parse('http://subdomain.example.com', 'http://example.com', [
      'subdomain.example.com',
    ]);
    expect(result).toEqual({ medium: 'internal', referer: null, term: null });
  });

  it('should handle case-insensitive domain matching', () => {
    let result = parse('http://WWW.GOOGLE.COM/search?q=test');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: 'test',
    });
  });

  it('should handle URLs with ports', () => {
    let result = parse('http://www.google.com:8080/search?q=test');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: 'test',
    });
  });

  it('should handle URLs with username and password', () => {
    let result = parse('http://user:pass@www.google.com/search?q=test');
    expect(result).toEqual({
      medium: 'search',
      referer: 'Google',
      term: 'test',
    });
  });

  it('should handle relative URLs when pageUrl is provided', () => {
    let result = parse('/path', 'http://www.example.com');
    expect(result).toEqual({ medium: 'internal', referer: null, term: null });
  });
});
