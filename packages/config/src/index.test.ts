import { expect } from 'earl'
import { existsSync, readFileSync } from 'fs'
import { dirname, join, relative } from 'path'

// Consumers read projects from the db.sqlite that `build.ts` writes, through
// ProjectService. An export that loads project code at runtime brings back the
// slow, coupled imports that the database replaced.
const FORBIDDEN = [
  'build.ts',
  'common/',
  'discovery/',
  'processing/',
  'projects/',
  'templates/',
  'tokens/',
]

describe('@l2beat/config exports', () => {
  it('do not load project code at runtime', () => {
    const reached = runtimeImports(join(__dirname, 'index.ts'))
    const forbidden = [...reached.entries()]
      .filter(([file]) => FORBIDDEN.some((prefix) => file.startsWith(prefix)))
      .map(([file, via]) => `${file} (imported by ${via})`)

    expect(forbidden).toEqual([])
  })
})

/** Files reachable from `entry` through value imports, with an importer each. */
function runtimeImports(entry: string): Map<string, string> {
  const reached = new Map<string, string>()
  const queue = [entry]
  while (queue.length > 0) {
    const file = queue.shift() as string
    if (!file.endsWith('.ts')) continue
    for (const specifier of valueImportSpecifiers(readFileSync(file, 'utf8'))) {
      const target = resolve(dirname(file), specifier)
      const key = relative(__dirname, target)
      if (target === entry || reached.has(key)) continue
      reached.set(key, relative(__dirname, file))
      queue.push(target)
    }
  }
  return reached
}

const IMPORT =
  /^(?:import|export)\s+(type\s+)?(?:([\s\S]*?)\s+from\s+)?['"](\.[^'"]*)['"]/gm

/** Relative specifiers of the imports and re-exports that run at runtime. */
function valueImportSpecifiers(source: string): string[] {
  const specifiers: string[] = []
  for (const [, typeOnly, clause, specifier] of source.matchAll(IMPORT)) {
    if (typeOnly || (clause && isTypeOnlyClause(clause))) continue
    specifiers.push(specifier as string)
  }
  return specifiers
}

/** `{ type A, type B }`: every named member is a type. */
function isTypeOnlyClause(clause: string): boolean {
  const members = /^\{([\s\S]*)\}$/.exec(clause.trim())?.[1]
  if (members === undefined) return false
  const names = members
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name !== '')
  return names.length > 0 && names.every((name) => name.startsWith('type '))
}

function resolve(from: string, specifier: string): string {
  const base = join(from, specifier)
  const candidates = /\.(ts|json)$/.test(base)
    ? [base]
    : [`${base}.ts`, join(base, 'index.ts')]
  const found = candidates.find((path) => existsSync(path))
  if (!found) {
    throw new Error('Cannot resolve import', { cause: { from, specifier } })
  }
  return found
}
