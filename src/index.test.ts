import { describe, expect, it, vi } from 'vitest';
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

  // Chatbot/AI referrers
  it('should correctly parse ChatGPT referral', () => {
    let result = parse('https://chatgpt.com/');
    expect(result).toEqual({ medium: 'chatbot', referer: 'ChatGPT', term: null });
  });

  it('should correctly parse Claude referral', () => {
    let result = parse('https://claude.ai/chat');
    expect(result).toEqual({ medium: 'chatbot', referer: 'Claude.ai', term: null });
  });

  it('should correctly parse Perplexity referral', () => {
    let result = parse('https://perplexity.ai/search?q=test');
    expect(result).toEqual({ medium: 'chatbot', referer: 'Perplexity.ai', term: null });
  });

  it('should correctly parse Google Gemini referral', () => {
    let result = parse('https://gemini.google.com/app');
    expect(result).toEqual({ medium: 'chatbot', referer: 'Google Gemini', term: null });
  });

  it('should correctly parse DeepSeek referral', () => {
    let result = parse('https://chat.deepseek.com/');
    expect(result).toEqual({ medium: 'chatbot', referer: 'DeepSeek', term: null });
  });

  it('should correctly parse Grok referral', () => {
    let result = parse('https://grok.com/');
    expect(result).toEqual({ medium: 'chatbot', referer: 'Grok', term: null });
  });

  it('should correctly parse Microsoft Copilot referral', () => {
    let result = parse('https://copilot.microsoft.com/');
    expect(result).toEqual({ medium: 'chatbot', referer: 'Microsoft Copilot', term: null });
  });

  it('should correctly parse Phind referral', () => {
    let result = parse('https://phind.com/search');
    expect(result).toEqual({ medium: 'chatbot', referer: 'Phind', term: null });
  });

  // New/updated social referrers
  it('should correctly parse Bluesky referral', () => {
    let result = parse('https://go.bsky.app/abc');
    expect(result).toEqual({ medium: 'social', referer: 'Bluesky', term: null });
  });

  it('should correctly parse Mastodon referral', () => {
    let result = parse('https://mastodon.social/@user/123');
    expect(result).toEqual({ medium: 'social', referer: 'Mastodon', term: null });
  });

  it('should correctly parse Threads referral', () => {
    let result = parse('https://threads.net/@user');
    expect(result).toEqual({ medium: 'social', referer: 'Threads', term: null });
  });

  // Brave search
  it('should correctly parse Brave Search', () => {
    let result = parse('https://search.brave.com/search?q=test');
    expect(result).toEqual({ medium: 'search', referer: 'Brave', term: 'test' });
  });
});

describe('domain boundary matching (issue #35)', () => {
  it.each([
    'netflix.com',
    'dropbox.com',
    'box.com',
    'fedex.com',
    'etix.com',
    'tix.com',
    'fast.co',
    'mint.co',
    'notgoogle.com',
    'mybing.com',
    'flask.com',
    'facebook.ru',
  ])('does not match %s by a known domain it merely ends with', (hostname) => {
    expect(parse(`https://${hostname}/`)).toEqual({
      medium: 'unknown',
      referer: hostname,
      term: null,
    });
  });

  it.each([
    ['https://x.com/home', 'social', 'Twitter', null],
    ['https://mobile.x.com/home', 'social', 'Twitter', null],
    ['https://t.co/abc', 'social', 'Twitter', null],
    ['https://a.b.t.co/abc', 'social', 'Twitter', null],
    ['https://google.com/search?q=kites', 'search', 'Google', 'kites'],
    ['https://cse.google.com/search?q=kites', 'search', 'Google', 'kites'],
    ['https://mail.google.com/mail/u/0', 'email', 'Gmail', null],
    ['https://inbox.mail.google.com/', 'email', 'Gmail', null],
    ['https://gemini.google.com/app', 'chatbot', 'Google Gemini', null],
  ])('matches %s on a label boundary', (url, medium, referer, term) => {
    expect(parse(url)).toEqual({ medium, referer, term });
  });
});

describe('path-scoped referer rules', () => {
  it('prefers a narrower path even when a broader rule appears first in the data', async () => {
    vi.resetModules();
    vi.doMock('./utils/latest-referers.json', () => ({
      default: {
        search: {
          Bing: { domains: ['bing.com/images'], parameters: ['q'] },
          'Bing Images': { domains: ['bing.com/images/search'], parameters: ['q'] },
        },
      },
    }));

    try {
      const { parse: parseFixture } = await import('./index');
      expect(parseFixture('https://bing.com/images/search?q=cats')).toEqual({
        medium: 'search',
        referer: 'Bing Images',
        term: 'cats',
      });
    } finally {
      vi.doUnmock('./utils/latest-referers.json');
      vi.resetModules();
    }
  });

  it('matches Google Images by its /imgres path and reads the q term', () => {
    expect(parse('https://google.com/imgres?q=kites&imgurl=x')).toEqual({
      medium: 'search',
      referer: 'Google Images',
      term: 'kites',
    });
  });

  it('does not match a path rule when the path only shares a prefix with it', () => {
    expect(parse('https://google.com/products-fake?q=kites')).toEqual({
      medium: 'search',
      referer: 'Google',
      term: 'kites',
    });
  });

  it('matches a rule path with a trailing slash when the URL path omits it', () => {
    expect(parse('https://apollo.lv/portal/search?q=riga')).toEqual({
      medium: 'search',
      referer: 'Apollo Latvia',
      term: 'riga',
    });
  });

  it('matches a rule whose hostname is written in uppercase', () => {
    expect(parse('https://www.sozluk.com/entry')).toEqual({
      medium: 'social',
      referer: 'Eksi Sozluk',
      term: null,
    });
  });

  it('matches a fully qualified hostname that ends in a root dot', () => {
    expect(parse('https://www.google.com./search?q=kites')).toEqual({
      medium: 'search',
      referer: 'Google',
      term: 'kites',
    });
  });

  it.each([
    ['https://orange.fr/webmail/inbox', 'email', 'Orange Webmail', null],
    ['https://m.orange.fr/webmail', 'email', 'Orange Webmail', null],
    ['https://apollo.lv/portal/search/results?q=riga', 'search', 'Apollo Latvia', 'riga'],
    ['https://bing.com/images/search?q=cats', 'search', 'Bing Images', 'cats'],
    ['https://www.bing.com/images/search?Q=cats', 'search', 'Bing Images', 'cats'],
    ['https://google.co.uk/imgres?q=kites', 'search', 'Google Images', 'kites'],
    ['https://GOOGLE.COM/imgres?q=kites', 'search', 'Google Images', 'kites'],
    ['https://google.com:8080/imgres?q=kites', 'search', 'Google Images', 'kites'],
    ['https://www.google.com/imgres?q=kites', 'search', 'Google Images', 'kites'],
    ['https://www.google.co.uk/imgres?q=kites&imgurl=x', 'search', 'Google Images', 'kites'],
    ['https://www.google.de/imgres?q=drachen', 'search', 'Google Images', 'drachen'],
    ['https://www.google.com.au/imgres?q=kites', 'search', 'Google Images', 'kites'],
    ['https://WWW.GOOGLE.COM/imgres?q=kites', 'search', 'Google Images', 'kites'],
    ['https://www.google.com./imgres?q=kites', 'search', 'Google Images', 'kites'],
    ['https://www.google.com/imgres', 'search', 'Google Images', null],
    ['https://www.google.com/products?q=boots', 'search', 'Google Product Search', 'boots'],
    ['https://google.com/products/catalog?q=boots', 'search', 'Google Product Search', 'boots'],
    ['https://inbox.com/search/?q=news', 'search', 'Inbox.com', 'news'],
    ['https://inbox.com/search?q=news', 'search', 'Inbox.com', 'news'],
  ])('matches path rule for %s', (url, medium, referer, term) => {
    expect(parse(url)).toEqual({ medium, referer, term });
  });

  it.each([
    // the host-only rule wins when the path does not match a path rule
    ['https://inbox.com/mail', 'email', 'Inbox.com', null],
    ['https://google.com/IMGRES?q=kites', 'search', 'Google', 'kites'],
    ['https://google.com/maps/imgres?q=kites', 'search', 'Google', 'kites'],
    ['https://google.com/imgres%2Fx?q=kites', 'search', 'Google', 'kites'],
    ['https://google.com/search?q=kites&next=/imgres', 'search', 'Google', 'kites'],
    ['https://google.com/#/imgres', 'search', 'Google', null],
    ['https://bing.com/images?q=cats', 'search', 'Bing', 'cats'],
    // a more specific host-only rule beats a path rule on a parent domain
    ['https://mail.google.com/products', 'email', 'Gmail', null],
    ['https://mail.google.com/imgres?q=kites', 'email', 'Gmail', null],
    ['https://gemini.google.com/imgres?q=kites', 'chatbot', 'Google Gemini', null],
    // www Google hosts outside /imgres stay with the host-only Google rule
    ['https://www.google.com/imgres-fake?q=kites', 'search', 'Google', 'kites'],
    ['https://www.google.co.uk/search?q=kites', 'search', 'Google', 'kites'],
    ['https://www.google.de/search?q=drachen', 'search', 'Google', 'drachen'],
    // hosts known only through path rules stay unknown off those paths
    ['https://orange.fr/news', 'unknown', 'orange.fr', null],
    ['https://orange.fr/webmailer', 'unknown', 'orange.fr', null],
    ['https://apollo.lv/portal/searching?q=riga', 'unknown', 'apollo.lv', null],
  ])('falls back from path rules for %s', (url, medium, referer, term) => {
    expect(parse(url)).toEqual({ medium, referer, term });
  });

  it('reports a path-rule referer as internal when it matches the page host', () => {
    expect(parse('https://google.com/imgres?q=kites', 'https://google.com/page')).toEqual({
      medium: 'internal',
      referer: null,
      term: null,
    });
  });
});
