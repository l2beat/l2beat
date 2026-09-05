// Parity check: the concept relations Soufflé derives (rules/concepts.dl) must reproduce the
// base facts the legacy TypeScript extractor used to emit directly. Its TSVs are the oracle;
// golden/<fixture>/*.facts keeps them for the two fixture contracts.
//
//   tsx src/parity.ts --fixtures                                   # run the pipeline on contracts/*.sol, compare with golden/
//   tsx src/parity.ts <golden-facts-dir> <derived-dir> [--ignore rel:col,...] [--quiet]
//
// Prints one line per relation: `=` identical, or how many rows are missing/extra with examples.
// Exit code 1 when any relation differs.

import { existsSync, readdirSync, readFileSync } from 'fs'
import { basename, join, resolve } from 'path'
import { runPipeline } from './pipeline'

const ROOT = resolve(__dirname, '..')

function readRows(path: string): string[] {
  if (!existsSync(path)) return []
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.length > 0)
}

export interface ParityOptions {
  /** Columns to blank out before comparing, e.g. { callSite: [5] } to ignore Text. */
  ignore?: Record<string, number[]>
  quiet?: boolean
  examples?: number
}

export interface RelationParity {
  relation: string
  golden: number
  derived: number
  missing: string[]
  extra: string[]
}

export function compareRelations(
  goldenDir: string,
  derivedDir: string,
  opts: ParityOptions = {},
): RelationParity[] {
  const relations = readdirSync(goldenDir)
    .filter((f) => f.endsWith('.facts'))
    .map((f) => f.replace(/\.facts$/, ''))
    .sort()
  const out: RelationParity[] = []
  for (const relation of relations) {
    const blank = new Set(opts.ignore?.[relation] ?? [])
    const norm = (row: string): string =>
      blank.size === 0
        ? row
        : row
            .split('\t')
            .map((c, i) => (blank.has(i) ? '' : c))
            .join('\t')
    const golden = new Set(
      readRows(join(goldenDir, `${relation}.facts`)).map(norm),
    )
    const derived = new Set(
      readRows(join(derivedDir, `${relation}.csv`)).map(norm),
    )
    out.push({
      relation,
      golden: golden.size,
      derived: derived.size,
      missing: [...golden].filter((r) => !derived.has(r)).sort(),
      extra: [...derived].filter((r) => !golden.has(r)).sort(),
    })
  }
  return out
}

export function formatParity(
  results: RelationParity[],
  examples = 3,
): { text: string; ok: boolean } {
  const lines: string[] = []
  let ok = true
  for (const r of results) {
    if (r.missing.length === 0 && r.extra.length === 0) {
      lines.push(`  = ${r.relation.padEnd(14)} ${String(r.golden).padStart(6)} rows`)
      continue
    }
    ok = false
    lines.push(
      `  ✗ ${r.relation.padEnd(14)} golden ${r.golden}, derived ${r.derived}: ${r.missing.length} missing, ${r.extra.length} extra`,
    )
    for (const m of r.missing.slice(0, examples))
      lines.push(`      - ${m.replace(/\t/g, ' ⇥ ')}`)
    for (const e of r.extra.slice(0, examples))
      lines.push(`      + ${e.replace(/\t/g, ' ⇥ ')}`)
  }
  return { text: lines.join('\n'), ok }
}

async function fixtures(): Promise<void> {
  const contractsDir = join(ROOT, 'contracts')
  let failed = 0
  for (const file of readdirSync(contractsDir)
    .filter((f) => f.endsWith('.sol'))
    .sort()) {
    const name = basename(file, '.sol')
    const goldenDir = join(ROOT, 'golden', name)
    if (!existsSync(goldenDir)) {
      console.log(`  ? ${name}: no golden folder, skipped`)
      continue
    }
    const outDir = join(ROOT, 'out', 'parity', name)
    const result = await runPipeline({
      unit: file,
      source: readFileSync(join(contractsDir, file), 'utf8'),
      outDir,
      rulesDir: join(ROOT, 'rules'),
      cacheDir: join(ROOT, '.cache'),
    })
    const results = compareRelations(goldenDir, join(outDir, 'derived'))
    const { text, ok } = formatParity(results)
    const total = results.reduce((n, r) => n + r.golden, 0)
    console.log(
      `${ok ? 'ok  ' : 'FAIL'} ${name}: ${result.factsWritten.rows} base rows → ${total} concept rows in golden, Soufflé ${result.timings.souffleMs.toFixed(0)} ms`,
    )
    if (!ok) {
      failed++
      console.log(text)
    }
  }
  process.exitCode = failed > 0 ? 1 : 0
}

function main(): void {
  if (process.argv[2] === '--fixtures') {
    fixtures().catch((e: unknown) => {
      console.error(e instanceof Error ? e.message : e)
      process.exitCode = 1
    })
    return
  }
  const [goldenDir, derivedDir, ...rest] = process.argv.slice(2)
  if (!goldenDir || !derivedDir) {
    throw new Error(
      'usage: parity.ts --fixtures | <golden-facts-dir> <derived-dir> [--ignore rel:col,...] [--quiet]',
    )
  }
  const opts: ParityOptions = {}
  const ignoreAt = rest.indexOf('--ignore')
  if (ignoreAt >= 0) {
    opts.ignore = {}
    for (const spec of (rest[ignoreAt + 1] ?? '').split(',')) {
      const [rel, col] = spec.split(':')
      if (rel && col) (opts.ignore[rel] ??= []).push(Number(col))
    }
  }
  if (rest.includes('--quiet')) opts.quiet = true
  const results = compareRelations(goldenDir, derivedDir, opts)
  const { text, ok } = formatParity(results)
  if (!opts.quiet || !ok) console.log(text)
  const total = results.reduce((n, r) => n + r.golden, 0)
  const bad = results.filter((r) => r.missing.length + r.extra.length > 0)
  console.log(
    ok
      ? `parity: all ${results.length} relations identical (${total} rows)`
      : `parity: ${bad.length}/${results.length} relations differ (${bad.map((r) => r.relation).join(', ')})`,
  )
  process.exitCode = ok ? 0 : 1
}

if (process.argv[1]?.endsWith('parity.ts')) main()
