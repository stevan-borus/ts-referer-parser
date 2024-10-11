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

type RefererSource =
  | 'Google'
  | 'Yandex Maps'
  | 'Yahoo!'
  | 'TalkTalk'
  | '1.cz'
  | 'Softonic'
  | 'GAIS'
  | 'Freecause'
  | '360.cn'
  | 'RPMFind'
  | 'Comcast'
  | 'Voila'
  | 'Nifty'
  | 'Atlas'
  | 'Lo.st'
  | 'DasTelefonbuch'
  | 'Fireball'
  | '1und1'
  | 'Virgilio'
  | 'Telstra'
  | 'Web.nl'
  | 'Plazoo'
  | 'Goyellow.de'
  | 'AOL'
  | 'Acoon'
  | 'Free'
  | 'Apollo Latvia'
  | 'HighBeam'
  | 'I-play'
  | 'FriendFeed'
  | 'Yasni'
  | 'Gigablast'
  | 'Arcor'
  | 'arama'
  | 'Fixsuche'
  | 'Apontador'
  | 'Search.com'
  | 'Monstercrawler'
  | 'Google Images'
  | 'ABCsøk'
  | 'Google Product Search'
  | 'Blogpulse'
  | 'Hooseek.com'
  | 'Dalesearch'
  | 'Alice Adsl'
  | 'T-Online'
  | 'Sogou'
  | 'Hit-Parade'
  | 'SearchCanvas'
  | 'Jungle Key'
  | 'Interia'
  | 'Genieo'
  | 'Tiscali'
  | 'Gomeo'
  | 'Facebook'
  | 'Twitter'
  | 'LinkedIn'
  | 'Instagram'
  | 'Pinterest'
  | 'YouTube'
  | 'Reddit'
  | 'Tumblr'
  | 'WhatsApp'
  | 'Telegram'
  | 'Snapchat'
  | 'TikTok'
  | (string & {});

export type Referer = {
  medium: Medium;
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
