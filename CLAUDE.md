# ts-referer-parser

## Release Workflow (using changesets)

```bash
# 1. When making changes, add a changeset
pnpm changeset
# prompts: patch/minor/major? description of change?

# 2. Commit the changeset file with your code

# 3. When ready to release:
pnpm version          # consumes changesets, bumps version, updates CHANGELOG
git add -A && git commit -m "v1.x.x"
git tag v1.x.x && git push --follow-tags

# 4. Publish
pnpm release          # builds + publishes to npm

# 5. Create GitHub release
gh release create v1.x.x --title "v1.x.x" --generate-notes
```
