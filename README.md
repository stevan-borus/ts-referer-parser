# TS Referer Parser

A TypeScript-based referer parser library inspired by [nodejs-referer-parser](https://github.com/snowplow-referer-parser/nodejs-referer-parser). This library can be used in any JavaScript or TypeScript project, including various frameworks like React, Vue, Angular, or Node.js applications.

The implementation uses the shared 'database' of known referers found in [file](https://s3-eu-west-1.amazonaws.com/snowplow-hosted-assets/third-party/referer-parser/referers-latest.json) as it says in the [snowplow-referer-parser/referer-parser](https://github.com/snowplow-referer-parser/referer-parser) README.

## Installation

To install the package:

```bash
pnpm add ts-referer-parser
```

If you're using npm or yarn, you can use their respective commands:

```bash
npm install ts-referer-parser
# or
yarn add ts-referer-parser
```

## Usage

```typescript
import { parse } from "ts-referer-parser";

async function example() {
  let result = await parse("", "http://www.example.com/");

  console.log("Direct traffic:", result);
  // Output: Direct traffic: { medium: 'direct', referer: null, term: null }

  result = await parse(
    "https://www.facebook.com/",
    "http://www.example.com/"
  );

  console.log("Social media referral:", result);
  // Output: Social media referral: { medium: 'social', referer: 'facebook', term: null }

  result = await parse(
    "http://www.google.com/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari",
    "http://www.example.com/"
  );
  
  console.log("Search engine referral:", result);
  // Output: Search engine referral: { medium: 'search', referer: 'Google', term: 'gateway oracle cards denise linn' }
}

example();
```

### Extracting Referer

To use this library effectively, you need to extract the referer URL. The method for doing this differs between client-side and server-side environments:

```javascript
let referer = '';

if (typeof window !== 'undefined') {
  // Client-side (browser) environment
  referer = document.referrer;
} else {
  // Server-side environment
  // Note: The exact method to get the referer may vary depending on your server setup
  referer = request.headers.referer; // Example for Express.js
}

// Now you can use the referer with the parse function
const result = await parse(referer, currentPageUrl);
```

Note: In a server-side environment, the method to access the referer may vary depending on your server setup and framework. The example above assumes an Express.js-like setup.

## API

### `parse(refererUrl: string, pageUrl?: string, internalDomains: string[] = []): Promise<Referer>`

Parses the given referer URL and returns a Promise that resolves to a `Referer` object containing:

- `medium`: The type of referer (e.g., 'search', 'social', 'unknown', 'internal', 'direct', 'invalid')
- `referer`: The name of the referer (e.g., 'google', 'facebook', 'twitter')
- `term`: The search term used, if applicable (null otherwise)

The function automatically fetches and caches the latest referer data from Snowplow's S3 bucket. The cache is valid for 24 hours to optimize performance.

## Features

- Supports various search engines, social media platforms, and email providers
- Handles internal referrals
- Caches referer data for improved performance
- Typescript support

## Project Structure

- `src/index.ts`: Contains the main parsing logic
- `src/types.ts`: Defines the TypeScript interfaces
- `src/index.test.ts`: Contains the test suite

## Testing

This library uses Vitest for testing. To run the tests, use the following command:

```bash
pnpm test
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgements

- [Snowplow](https://github.com/snowplow/referer-parser) for the original referer-parser
- [nodejs-referer-parser](https://github.com/snowplow-referer-parser/nodejs-referer-parser) for inspiration

## Development

To set up the project for development:

1. Clone the repository
2. Run `pnpm i` to install dependencies
3. Use `pnpm test` to run the test suite
4. Use `pnpm build` to build the project

Note: While pnpm is the preferred package manager for this project, npm or yarn should work as well.
