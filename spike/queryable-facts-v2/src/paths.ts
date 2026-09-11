// Where things are: the library, the solc cache, the runs, the discovery projects.

import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { basename, join, resolve } from 'path'
import type { RunInput } from './pipeline'

/**
 * The spike's folder. Under tsx (CommonJS) it is the parent of this file; under Vite's module runner
 * (ESM, no __dirname) it is the working directory, which `pnpm dev` runs from; QF_ROOT overrides both.
 */
export const ROOT =
  process.env.QF_ROOT ??
  (typeof __dirname === 'string' ? resolve(__dirname, '..') : process.cwd())
export const RULES_DIR = join(ROOT, 'rules')
export const CACHE_DIR = join(ROOT, '.cache')
export const RUNS_DIR = join(ROOT, 'out', 'runs')
export const FIXTURES_DIR = join(ROOT, 'contracts')
/** Hand-written projects in discovery's shape, see projects/README.md. */
export const LOCAL_PROJECTS_DIR = join(ROOT, 'projects')
export const PROJECTS_DIR = resolve(
  ROOT,
  '..',
  '..',
  'packages',
  'config',
  'src',
  'projects',
)

export function timestamp(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

export function slugify(text: string): string {
  return text.replace(/\.sol$/, '').replace(/[^\w.-]+/g, '_')
}

/** A project name under projects/ or packages/config/src/projects, a folder with discovered.json + .flat, or a .sol file. */
export function resolveInput(what: string): RunInput {
  if (what.endsWith('.sol') && existsSync(what))
    return {
      kind: 'file',
      name: basename(what),
      source: readFileSync(what, 'utf8'),
    }
  const dir = existsSync(join(what, 'discovered.json'))
    ? what
    : (projectDir(what) ?? join(PROJECTS_DIR, what))
  if (
    !existsSync(join(dir, 'discovered.json')) ||
    !existsSync(join(dir, '.flat'))
  )
    throw new Error(
      `${what} is neither a .sol file nor a project folder with discovered.json and .flat/`,
    )
  return { kind: 'project', dir }
}

/** The folder of a project offered by name: the spike's own projects/ first, then packages/config. */
export function projectDir(id: string): string | undefined {
  if (!/^[\w.-]+$/.test(id)) return undefined
  for (const base of [LOCAL_PROJECTS_DIR, PROJECTS_DIR]) {
    const dir = join(base, id)
    if (
      existsSync(join(dir, 'discovered.json')) &&
      existsSync(join(dir, '.flat'))
    )
      return dir
  }
  return undefined
}

export function inputName(input: RunInput): string {
  return input.kind === 'file' ? slugify(input.name) : basename(input.dir)
}

export function listRuns(): Array<{ id: string; dir: string; mtime: number }> {
  if (!existsSync(RUNS_DIR)) return []
  return readdirSync(RUNS_DIR)
    .filter((d) => existsSync(join(RUNS_DIR, d, 'run.json')))
    .map((d) => ({
      id: d,
      dir: join(RUNS_DIR, d),
      mtime: statSync(join(RUNS_DIR, d, 'run.json')).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime)
}

/** out/runs/<id>, checked to exist. */
export function runDirOf(id: string): string {
  if (!/^[\w.-]+$/.test(id)) throw new Error(`bad run id ${id}`)
  const dir = join(RUNS_DIR, id)
  if (!existsSync(join(dir, 'run.json'))) throw new Error(`unknown run ${id}`)
  return dir
}
