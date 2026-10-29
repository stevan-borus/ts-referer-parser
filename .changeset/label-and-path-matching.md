---
"ts-referer-parser": patch
---

Match referrer domains on DNS label boundaries to avoid false classifications such as Netflix as Twitter. Recognize path-specific sources such as Google Images and Bing Images, while preserving hostname specificity and search-term extraction. Normalize hostname case and trailing DNS root dots.

Some URLs previously classified as Google or Bing now report Google Images, Google Product Search or Bing Images when a matching path rule exists. Inbox.com search URLs now report the search medium instead of email. More specific hostname rules still take priority over path rules on parent domains.

Add explicit `www` aliases for Google Images across the listed regional Google domains, so those URLs match Google Images without changing hostname priority for sources such as Gmail and Gemini.
