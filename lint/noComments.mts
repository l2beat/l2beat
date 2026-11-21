import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { parseSync } from 'rolldown/utils'

const BASELINE = 'lint/noComments.baseline.json'
const SOURCE = /\.[cm]?[jt]sx?$/
const SKIPPED = /(^|\/)(node_modules|dist|build|\.cache)\/|^docs\//
const TOOL_DIRECTIVE =
  /^\s*(biome-ignore|@ts-expect-error|@ts-nocheck|@vite-ignore|[#@]__PURE__|@jsxImportSource|@vitest-environment)|^\/\s*<reference /

type Counts = Record<string, number>
type Comment = { file: string; line: number }

const root = execFileSync('git', ['rev-parse', '--show-toplevel'])
  .toString()
  .trim()
const args = process.argv.slice(2)
const scopes = args
  .filter((arg) => !arg.startsWith('--'))
  .map((arg) => relative(root, resolve(arg)))
process.chdir(root)

const comments = findComments()

if (args.includes('--list')) {
  for (const { file, line } of comments) {
    if (scopes.length === 0 || scopes.some((scope) => isInside(file, scope))) {
      process.stdout.write(`${file}:${line}\n`)
    }
  }
  process.exit(0)
}

const counts: Counts = {}
for (const { file } of comments) counts[file] = (counts[file] ?? 0) + 1

const update = args.includes('--update')
if (!existsSync(BASELINE)) {
  if (!update) fail([`${BASELINE} is missing. Create it with --update.`])
  writeBaseline(counts)
  process.exit(0)
}

const baseline: Counts = JSON.parse(readFileSync(BASELINE, 'utf8'))
const grown = Object.keys(counts).filter(
  (file) => counts[file] > (baseline[file] ?? 0),
)
if (grown.length > 0) {
  fail([
    'Code comments are banned. These files have more comments than lint/noComments.baseline.json allows:',
    '',
    ...comments
      .filter(({ file }) => grown.includes(file))
      .map(({ file, line }) => `  ${file}:${line}`),
    '',
    'Delete a comment that repeats the code or describes code that is gone.',
    'For a workaround, fix it, or list it in the PR for a follow-up.',
    'For a non-obvious decision, write it up in docs/adr.',
    'The steps are in .agents/skills/delete-comment/SKILL.md.',
  ])
}

const shrunk = Object.keys(baseline).filter(
  (file) => (counts[file] ?? 0) < baseline[file],
)
if (shrunk.length > 0) {
  if (!update) {
    fail([
      'Comments were deleted from these files. Lock that in with `pnpm lint:comments --update`:',
      '',
      ...shrunk.map((file) => `  ${file}`),
    ])
  }
  writeBaseline(counts)
}

function findComments(): Comment[] {
  const files = execFileSync('git', ['ls-files', '-z'], {
    maxBuffer: 1 << 30,
  })
    .toString()
    .split('\0')
    .filter((file) => SOURCE.test(file) && !SKIPPED.test(file))
  const found: Comment[] = []
  for (const file of files) {
    if (!existsSync(file)) continue
    const source = readFileSync(file, 'utf8')
    for (const { value, start } of parseSync(file, source).comments) {
      if (TOOL_DIRECTIVE.test(value)) continue
      found.push({ file, line: lineAt(source, start) })
    }
  }
  return found
}

function isInside(file: string, scope: string) {
  return scope === '' || file === scope || file.startsWith(`${scope}/`)
}

function lineAt(source: string, offset: number) {
  let line = 1
  for (let i = source.indexOf('\n'); i !== -1 && i < offset; ) {
    line++
    i = source.indexOf('\n', i + 1)
  }
  return line
}

function writeBaseline(counts: Counts) {
  const sorted = Object.fromEntries(
    Object.entries(counts).sort(([a], [b]) => (a < b ? -1 : 1)),
  )
  writeFileSync(BASELINE, `${JSON.stringify(sorted, null, 2)}\n`)
}

function fail(lines: string[]): never {
  process.stderr.write(`${lines.join('\n')}\n`)
  process.exit(1)
}
