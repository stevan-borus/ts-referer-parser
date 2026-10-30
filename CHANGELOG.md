# ts-referer-parser

## 1.1.1

### Patch Changes

- [#38](https://github.com/stevan-borus/ts-referer-parser/pull/38) [`1a53eda`](https://github.com/stevan-borus/ts-referer-parser/commit/1a53eda935bd2e4ec8234c752cad479959f7ff1b) Thanks [@stevan-borus](https://github.com/stevan-borus)! - Match referrer domains on DNS label boundaries to avoid false classifications such as Netflix as Twitter. Recognize path-specific sources such as Google Images and Bing Images, while preserving hostname specificity and search-term extraction. Normalize hostname case and trailing DNS root dots.

  Some URLs previously classified as Google or Bing now report Google Images, Google Product Search or Bing Images when a matching path rule exists. Inbox.com search URLs now report the search medium instead of email. More specific hostname rules still take priority over path rules on parent domains.

  Add explicit `www` aliases for Google Images across the listed regional Google domains, so those URLs match Google Images without changing hostname priority for sources such as Gmail and Gemini.
