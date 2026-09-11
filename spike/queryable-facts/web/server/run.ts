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
import { BASE_RELATIONS } from '../../src/emit'
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

/** The single-file choices: the spike's fixtures. Discovery projects are listed by web/server/project.ts. */
export function listContracts(): ContractChoice[] {
  return listSol(FIXTURES_DIR, 'fixtures', '')
}

export function readContract(id: string): { name: string; source: string } {
  const [group, ...rest] = id.split(':')
  const rel = rest.join(':')
  if (rel.includes('..')) throw new Error('bad contract id')
  const dir = group === 'fixtures' ? FIXTURES_DIR : undefined
  if (!dir) throw new Error(`unknown contract group ${group}`)
  const path = join(dir, rel)
  return { name: basename(path), source: readFileSync(path, 'utf8') }
}

export function timestamp(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

const RUN_README = `This folder is one run of the queryable-facts pipeline (spike/queryable-facts).

  source.sol         the flattened Solidity source exactly as compiled
  solc-input.json    the standard-JSON request sent to solc (asks for the AST and the storage layout)
  solc-output.json   solc's answer: sources.<unit>.ast (compact AST) and contracts.<unit>.<Name>.storageLayout
  facts/<rel>.facts  layer 0, the AST as facts: one tab-separated file per relation (node, loc, child, attr,
                     num, attrList, numList, text, storageLayout, unit), produced mechanically by src/emit.ts.
                     Every row is something solc said; nothing here interprets Solidity.
  program.dl         the Soufflé program that ran: rules/schema.dl (layer 0 declarations) + rules/concepts.dl
                     (layer 1: syntax → concepts such as function, stmt, callSite, writeSite) + rules/lib.dl
                     (layers 2-6: call graph, writes, sender checks, findings) + rules/report.dl (+ .output for all)
  derived/<rel>.csv  every relation Soufflé derived (tab-separated), concept relations included
  report.md          the report rendered from the derived relations: may-writers per variable, unknown effects,
                     findings per entry point with their tier (structural / may / guaranteed / heuristic / unknown)
  qf, qf.mjs         the query commands: ./qf help, writers, function, guards, gaps, rows, source, explain, query.
                     They only filter and format derived relations; the logic is in program.dl.
  run.json           metadata: solc version, timings, counts
  ask/<n>-*.md       one transcript per question asked in the explorer's step 7: the question, the model,
                     every command the agent ran (sandboxed to this folder) and its answer
  scratch/           whatever the agent wrote while answering (extra Datalog rules, Soufflé outputs)

Start with:                     ./qf help
Who may write a variable:       ./qf writers <variable>
What guards an entry point:     ./qf guards <function>
Why a tuple holds:              ./qf explain 'findings("...", ..., 26)'   (any derived relation, down to node/child/attr)
Extra rules against this run:   ./qf query scratch/extra.dl
To re-run Soufflé by hand:      souffle --no-preprocessor -F facts -D derived program.dl
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

  const factRelations = Object.keys(BASE_RELATIONS).map((relation) => ({
    relation,
    rows: facts.entries(relation),
  }))

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
    syntheticIds: result.syntheticIds,
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
        baseRows: result.factsWritten.rows,
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
