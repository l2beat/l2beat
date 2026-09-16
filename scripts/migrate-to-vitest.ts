/**
 * Rewrites one package's earl + mocha tests to vitest.
 *
 *   pnpm tsx scripts/migrate-to-vitest.ts packages/<name> [--dry-run] [--files-only]
 *
 * Anything it cannot rewrite is printed with a file, a line and a snippet, and
 * makes the command exit non-zero, so a migration is this command plus the
 * fixups it names. Run `pnpm install` and `pnpm fix` afterwards.
 *
 * The four mappings with no obvious right answer:
 *
 * - `toEqual` becomes `toStrictEqual`. earl's equality compares prototypes and
 *   treats `{ a: undefined }` as different from `{}`; vitest's `toEqual` does
 *   neither, so keeping the name would silently weaken thousands of
 *   assertions. The cost is that a test comparing a class instance against a
 *   plain object literal now fails and needs a deliberate `toEqual`.
 *
 * - `toThrow(Class, message)` becomes `toThrowWithMessage(Class, message)`,
 *   a matcher in `@l2beat/test-utils`. Splitting it into two assertions - the
 *   other option - duplicates the whole subject expression, which for the ~90
 *   sites in backend and discovery means duplicating multi-line arrow
 *   functions. `toBeRejectedWith(Class, message)` maps onto the same matcher
 *   behind `rejects`.
 *
 * - `toInclude(x)` becomes `toContain(x)` when `x` is a primitive literal and
 *   `toContainEqual(x)` otherwise, because `toContain` compares with
 *   `Object.is` and would quietly stop matching objects. The guess is printed
 *   for review, since `toContainEqual` rejects a string subject.
 *
 * - `toBeNullish()` becomes `expect(x == null).toBe(true)`. `toBeFalsy` would
 *   also accept `0` and `''`, and every current use is a genuine
 *   `null | undefined` check.
 */
import { runCli } from '../packages/test-utils/src/codemod/cli.js'

process.exitCode = runCli(process.argv.slice(2))
