# ts-referer-parser

## Release Workflow (automated via changesets)

Releases are automated by `.github/workflows/release.yml` (modeled on start-toast).
You no longer publish by hand.

```bash
# 1. When making changes that affect the published package, add a changeset
pnpm changeset
# prompts: patch/minor/major? description of change?

# 2. Commit the changeset file with your code and open a PR
```

On merge to `main`, the Release workflow:

- Collects pending changesets and opens (or updates) a **"chore(release): version
  packages"** PR that bumps the version and updates `CHANGELOG.md`.
- When **that** Release PR is merged, it builds and publishes to npm via
  `pnpm release` (`changeset publish`).

So: **merge feature PR → merge the Release PR → published.** No manual `pnpm
version` / `git tag` / `gh release` step.

### Skip the changeset for dev-only changes

Dependency bumps, CI/tooling, and other changes that don't affect the published
`dist/` should **not** include a changeset — they shouldn't trigger a version bump
or an npm release.

### Required setup (one-time, on GitHub/npm — not in code)

- **npm Trusted Publishing (OIDC)** configured for `ts-referer-parser`, pointed at
  this repo's `release.yml`. The workflow uses `id-token: write` +
  `NPM_CONFIG_PROVENANCE: true` and carries no npm token.
- **`CHANGESETS_GITHUB_TOKEN`** secret (a PAT) so the auto-opened Release PR can
  trigger the `PR Checks` workflow (the default `GITHUB_TOKEN` can't).
