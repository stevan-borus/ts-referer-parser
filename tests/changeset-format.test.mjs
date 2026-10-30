import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';

it('checks and formats the workspace without changing changeset front matter', () => {
  const directory = mkdtempSync(join(tmpdir(), 'changeset-format-'));
  const biome = fileURLToPath(new URL('../node_modules/@biomejs/biome/bin/biome', import.meta.url));
  const contents = '---\n"ts-referer-parser": patch\n---\n\nFix referrer matching.\n';

  try {
    copyFileSync(new URL('../biome.json', import.meta.url), join(directory, 'biome.json'));
    mkdirSync(join(directory, '.changeset'));
    const changeset = join(directory, '.changeset', 'example.md');
    writeFileSync(changeset, contents);

    for (const args of [
      ['check', '.'],
      ['format', '--write', '.'],
    ]) {
      const result = spawnSync(process.execPath, [biome, ...args], {
        cwd: directory,
        encoding: 'utf8',
      });
      expect(result.status, result.stdout + result.stderr).toBe(0);
      expect(readFileSync(changeset, 'utf8')).toBe(contents);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
