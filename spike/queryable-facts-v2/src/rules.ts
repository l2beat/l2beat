// The rule library: five files, one list of layers, two Soufflé programs.
//
//   0-solidity.dl    layer 0, unit stage: what solc said (the .input relations of a unit program)
//   1-syntax.dl      layer 1: from syntax to concepts
//   2-analysis.dl    layers 2-6: structure, calls, writes, sender checks, findings, answer tables
//   2-proposed-unit.dl  unit-level rules promoted from questions (interpretations), reviewed later
//   0-discovery.dl   layer 0, project stage: what discovery said
//   3-project.dl     layers 7-9: deployment, values, authority
//   4-proposed.dl    project-level rules promoted from questions (compositions)
//
// A run evaluates the unit program once per source file, then the project program once over the
// union of the units' *exported* relations plus discovery. A unit relation is exported when it is
// keyed by names rather than by solc node ids (node ids restart at 0 in every file, names carry the
// `<unit>:` prefix), which is decided from its declaration: every column is a symbol or one of the
// numeric columns that are not ids (Index, Slot, Line, ...). Queries read the same union.

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import {
  type Column,
  type Program,
  type ProgramDecl,
  parseProgram,
  withMarker,
} from './program'

export const UNIT_FILES = [
  '0-solidity.dl',
  '1-syntax.dl',
  '2-analysis.dl',
  '2-proposed-unit.dl',
]
export const PROJECT_FILES = ['0-discovery.dl', '3-project.dl', '4-proposed.dl']
export const RULE_FILES = [...UNIT_FILES, ...PROJECT_FILES]

export type Stage = 'unit' | 'project'

export interface RuleFile {
  name: string
  text: string
}

export interface RelationRecord {
  name: string
  columns: Column[]
  comment: string
  file: string
  line: number
  section: string
  stage: Stage
  kind: 'input' | 'derived'
  /** Unit relations the project stage and queries can read (see the header). */
  exported: boolean
  clauseCount: number
}

export interface Library {
  dir: string
  files: RuleFile[]
  unit: Program
  project: Program
  relations: Map<string, RelationRecord>
  exported: string[]
  /** The program run once per source file. */
  unitProgram: string
  /** The program run once per project: imports of the exported unit relations + discovery + layers 7-9. */
  projectProgram: string
}

/** Numeric columns that are not node ids. Anything else typed `number` marks a relation as internal. */
const NUMERIC_NAMES = new Set([
  'Index',
  'I',
  'J',
  'Idx',
  'Order',
  'Slot',
  'Offset',
  'Line',
  'StartLine',
  'EndLine',
  'Start',
  'Length',
  'Len',
  'Abstract',
  'Direct',
  'HasYul',
  'SlotNum',
  'Depth',
  'Count',
  'Arity',
  'Threshold',
])

export function isExportable(decl: ProgramDecl): boolean {
  return decl.columns.every(
    (c) => c.type === 'symbol' || NUMERIC_NAMES.has(c.name),
  )
}

export function formatDecl(name: string, columns: Column[]): string {
  return `.decl ${name}(${columns.map((c) => `${c.name}: ${c.type}`).join(', ')})`
}

/** Files that may be absent (runs made before they existed): read as empty. */
const OPTIONAL_FILES = new Set(['2-proposed-unit.dl', '4-proposed.dl'])

export function readRuleFiles(dir: string, names = RULE_FILES): RuleFile[] {
  return names.map((name) => ({
    name,
    text:
      OPTIONAL_FILES.has(name) && !existsSync(join(dir, name))
        ? ''
        : readFileSync(join(dir, name), 'utf8'),
  }))
}

function concat(files: RuleFile[]): string {
  return files.map((f) => withMarker(f.name, f.text)).join('\n')
}

/** `.output` for every declared relation that is neither an input nor already an output. */
function outputBlock(program: Program): string {
  const names = program.relations
    .filter((r) => !r.isInput && !r.isOutput)
    .map((r) => r.name)
  return `// ----- generated -----\n// Every relation is written out, so that the explorer can show it and a query can read it.\n${names
    .map((n) => `.output ${n}`)
    .join('\n')}\n`
}

/** Declarations + `.input` for the given relations, for a program that reads them from disk. */
export function importBlock(
  relations: Iterable<RelationRecord>,
  title = 'imported',
): string {
  const lines = [
    `// ----- ${title} -----`,
    '// Relations another program derived, read back from disk (one file per relation, the rows of every unit).',
  ]
  for (const r of relations) {
    lines.push(formatDecl(r.name, r.columns), `.input ${r.name}`)
  }
  return `${lines.join('\n')}\n`
}

export function loadLibrary(dir: string): Library {
  const files = readRuleFiles(dir)
  const byName = new Map(files.map((f) => [f.name, f]))
  const pick = (names: string[]) =>
    names.map((n) => byName.get(n)).filter((f): f is RuleFile => Boolean(f))
  const unit = parseProgram(concat(pick(UNIT_FILES)))
  const project = parseProgram(concat(pick(PROJECT_FILES)))
  const relations = new Map<string, RelationRecord>()
  const add = (program: Program, stage: Stage) => {
    for (const item of program.items) {
      if (item.kind !== 'decl') continue
      const info = program.relations.find((r) => r.name === item.relation)
      relations.set(item.relation, {
        name: item.relation,
        columns: item.columns,
        comment: item.comment,
        file: item.file,
        line: item.line,
        section: info?.section ?? '',
        stage,
        kind: info?.isInput ? 'input' : 'derived',
        exported:
          stage === 'unit' && !info?.isInput ? isExportable(item) : false,
        clauseCount: info?.clauseCount ?? 0,
      })
    }
  }
  add(unit, 'unit')
  add(project, 'project')
  const exported = [...relations.values()]
    .filter((r) => r.exported)
    .map((r) => r.name)
  const unitProgram = `${unit.text}\n${outputBlock(unit)}`
  const imports = importBlock(
    [...relations.values()].filter((r) => r.exported),
    'imported from the units',
  )
  const projectProgram = `${imports}\n${project.text}\n${outputBlock(project)}`
  return {
    dir,
    files,
    unit,
    project,
    relations,
    exported,
    unitProgram,
    projectProgram,
  }
}

/** The relations a query at the project stage can read: exported unit relations, discovery, project relations. */
export function availableAtProject(lib: Library): RelationRecord[] {
  return [...lib.relations.values()].filter(
    (r) => r.exported || r.stage === 'project',
  )
}

/** First sentence-ish line of a relation's comment, for one-line listings. */
export function firstLine(comment: string): string {
  const text = comment.replace(/\s+/g, ' ').trim()
  const m = /^(.*?[.!?])(\s|$)/.exec(text)
  return (m?.[1] ?? text).slice(0, 220)
}

/**
 * The catalogue an agent reads before writing a rule: every relation it can use at the project stage,
 * grouped by layer, one line each. `all` adds the unit-internal relations (usable only in a unit-level
 * query).
 */
export function catalog(lib: Library, all = false): string {
  const out: string[] = []
  const emit = (program: Program, stage: Stage) => {
    let section = ''
    for (const item of program.items) {
      if (item.kind === 'section') {
        section = item.title
        continue
      }
      if (item.kind !== 'decl') continue
      const rec = lib.relations.get(item.relation)
      if (!rec) continue
      if (!all && stage === 'unit' && !rec.exported && rec.kind !== 'input')
        continue
      if (section) {
        out.push('', `### ${section}`)
        section = ''
      }
      const cols = item.columns
        .map((c) => (c.type === 'symbol' ? c.name : `${c.name}: ${c.type}`))
        .join(', ')
      const tag =
        rec.kind === 'input'
          ? ' [fact]'
          : stage === 'unit' && !rec.exported
            ? ' [unit-internal]'
            : ''
      out.push(`- ${item.relation}(${cols})${tag} — ${firstLine(item.comment)}`)
    }
  }
  emit(lib.unit, 'unit')
  emit(lib.project, 'project')
  return out.join('\n').trim()
}
