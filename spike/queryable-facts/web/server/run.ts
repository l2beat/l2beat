// One explorer run: the shared pipeline plus everything the wizard needs to show its steps,
// written to out/runs/<runId>/ so a later step (or an AI pointed at the folder) can read it back.

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs'
import { basename, join, relative } from 'path'
import { fileURLToPath } from 'url'
import { isNode } from '../../src/ast'
import { RELATIONS } from '../../src/extract'
import { runPipeline } from '../../src/pipeline'
import type {
  ContractChoice,
  ContractStorageLayout,
  Diagnostic,
  RunResult,
} from '../shared/types'
import { parseProgram } from './program'

/** spike/queryable-facts (this file is web/server/run.ts). */
export const ROOT = fileURLToPath(new URL('../..', import.meta.url))
export const RUNS_DIR = join(ROOT, 'out', 'runs')
const FIXTURES_DIR = join(ROOT, 'contracts')
const ZORA_FLAT_DIR = join(
  ROOT,
  '..',
  '..',
  'packages',
  'config',
  'src',
  'projects',
  'zora',
  '.flat',
)

function listSol(dir: string, group: string, prefix: string): ContractChoice[] {
  if (!existsSync(dir)) return []
  const out: ContractChoice[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...listSol(path, group, `${prefix}${entry.name}/`))
    } else if (entry.name.endsWith('.sol')) {
      const text = readFileSync(path, 'utf8')
      out.push({
        id: `${group}:${prefix}${entry.name}`,
        label: `${prefix}${entry.name}`,
        group,
        lines: text.split('\n').length,
        bytes: statSync(path).size,
      })
    }
  }
  return out
}

export function listContracts(): ContractChoice[] {
  return [
    ...listSol(FIXTURES_DIR, 'fixtures', ''),
    ...listSol(ZORA_FLAT_DIR, 'zora', ''),
  ]
}

export function readContract(id: string): { name: string; source: string } {
  const [group, ...rest] = id.split(':')
  const rel = rest.join(':')
  if (rel.includes('..')) throw new Error('bad contract id')
  const dir =
    group === 'fixtures'
      ? FIXTURES_DIR
      : group === 'zora'
        ? ZORA_FLAT_DIR
        : undefined
  if (!dir) throw new Error(`unknown contract group ${group}`)
  const path = join(dir, rel)
  return { name: basename(path), source: readFileSync(path, 'utf8') }
}

function timestamp(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

const RUN_README = `This folder is one run of the queryable-facts pipeline (spike/queryable-facts).

  source.sol         the flattened Solidity source exactly as compiled
  solc-input.json    the standard-JSON request sent to solc (asks for the AST and the storage layout)
  solc-output.json   solc's answer: sources.<unit>.ast (compact AST) and contracts.<unit>.<Name>.storageLayout
  facts/<rel>.facts  base facts: one tab-separated file per relation, produced by src/extract.ts from the AST
  facts-provenance.tsv  for every fact row: relation, row, the AST node id and src it came from
  program.dl         the Soufflé program that ran: rules/schema.dl + rules/lib.dl + rules/report.dl (+ .output for all)
  derived/<rel>.csv  every relation Soufflé derived (tab-separated)
  report.md          the storage-writers style report rendered from the derived relations
  run.json           metadata: solc version, timings, counts

To re-run Soufflé by hand:      souffle --no-preprocessor -F facts -D derived program.dl
To ask why a tuple holds:       souffle --no-preprocessor -t explain -F facts -D derived program.dl
                                then type: explain writes("<F>", "<V>")
`

export async function runForExplorer(
  name: string,
  source: string,
): Promise<RunResult> {
  const unit = name.endsWith('.sol') ? name : `${name}.sol`
  const runId = `${unit.replace(/\.sol$/, '').replace(/[^\w.-]+/g, '_')}-${timestamp()}`
  const runDir = join(RUNS_DIR, runId)
  const result = await runPipeline({
    unit,
    source,
    outDir: runDir,
    rulesDir: join(ROOT, 'rules'),
    cacheDir: join(ROOT, '.cache'),
    outputAllRelations: true,
  })
  const { compiled, facts } = result

  const ast = compiled.output.sources?.[unit]?.ast
  if (!isNode(ast)) throw new Error('solc output has no AST')

  const storageLayout: ContractStorageLayout[] = []
  for (const [contract, data] of Object.entries(
    compiled.output.contracts?.[unit] ?? {},
  )) {
    const layout = data.storageLayout
    if (!layout) continue
    storageLayout.push({
      contract,
      storage: layout.storage.map((s) => ({
        label: s.label,
        slot: String(s.slot),
        offset: s.offset,
        type: s.type,
        astId: s.astId,
      })),
      types: Object.fromEntries(
        Object.entries(layout.types ?? {}).map(([k, v]) => [
          k,
          {
            label: v.label,
            numberOfBytes: String(v.numberOfBytes),
            encoding: v.encoding,
          },
        ]),
      ),
    })
  }

  const factRelations = Object.keys(RELATIONS).map((relation) => ({
    relation,
    rows: facts.entries(relation),
  }))
  const provenance = factRelations
    .flatMap(({ relation, rows }) =>
      rows.map(
        (r) =>
          `${relation}\t${r.cols.join('\t')}\t${r.origin?.id ?? ''}\t${r.origin?.src ?? ''}`,
      ),
    )
    .join('\n')
  writeFileSync(join(runDir, 'facts-provenance.tsv'), `${provenance}\n`)

  const input = compiled.input as {
    sources?: Record<string, { content?: string }>
  }
  const inputForDisplay = {
    ...compiled.input,
    sources: Object.fromEntries(
      Object.keys(input.sources ?? {}).map((k) => [
        k,
        { content: '<the source text>' },
      ]),
    ),
  }
  const diagnostics = ((compiled.output.errors ?? []) as Diagnostic[]).map(
    (e) => ({
      severity: e.severity,
      message: e.message,
      formattedMessage: e.formattedMessage,
    }),
  )

  const run: RunResult = {
    runId,
    runDir: relative(ROOT, runDir),
    unit,
    source,
    compile: {
      constraints: compiled.constraints,
      solcVersion: compiled.solcVersion,
      resolvedFrom: compiled.resolvedFrom,
      backend: 'native',
      warnings: compiled.warnings,
      input: inputForDisplay,
      diagnostics,
    },
    ast,
    storageLayout,
    facts: factRelations,
    program: parseProgram(result.program),
    derived: [...result.derived.entries()].map(([relation, rows]) => ({
      relation,
      rows,
    })),
    souffle: result.souffle,
    timings: result.timings,
    report: result.report,
    files: [],
  }
  writeFileSync(
    join(runDir, 'run.json'),
    JSON.stringify(
      {
        runId,
        unit,
        solcVersion: compiled.solcVersion,
        resolvedFrom: compiled.resolvedFrom,
        souffle: result.souffle,
        timings: result.timings,
        factRows: result.factsWritten.rows,
        derivedRows: run.derived.reduce((n, d) => n + d.rows.length, 0),
      },
      null,
      2,
    ),
  )
  writeFileSync(join(runDir, 'README.txt'), RUN_README)
  run.files = readdirSync(runDir).sort()
  return run
}
