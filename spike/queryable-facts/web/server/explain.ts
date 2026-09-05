// Asks Soufflé for the proof tree of one derived tuple, using its provenance mode
// (`souffle -t explain`), and turns the JSON it prints into a small tree.

import { spawnSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { Column, ExplainResult, ProofNode } from '../shared/types'

interface RawProof {
  premises?: string
  axiom?: string
  'rule-number'?: string
  children?: RawProof[]
}

interface RawRule {
  'rule-number': string
  rule: string
}

/** Formats a tuple the way Soufflé's explain shell expects and prints it. */
export function formatAtom(
  relation: string,
  cols: string[],
  columns: Column[],
): string {
  const args = cols.map((value, i) =>
    columns[i]?.type === 'number' ? value : JSON.stringify(value),
  )
  return `${relation}(${args.join(', ')})`
}

/** Extracts the first balanced `{...}` JSON object from Soufflé's chatty stdout. */
function firstJsonObject(text: string): string | undefined {
  const start = text.indexOf('{')
  if (start < 0) return undefined
  let depth = 0
  let inString = false
  for (let i = start; i < text.length; i++) {
    const c = text[i]
    if (inString) {
      if (c === '\\') i++
      else if (c === '"') inString = false
      continue
    }
    if (c === '"') inString = true
    else if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return text.slice(start, i + 1)
    }
  }
  return undefined
}

function cleanRule(rule: string): string {
  return rule
    .replace(/\+underscore_\d+/g, '_')
    .replace(/@generator_(\d+)/g, '_gen$1')
    .replace(/\n\s+/g, '\n    ')
}

function convert(raw: RawProof, rules: RawRule[]): ProofNode {
  if (raw.premises !== undefined) {
    const relation = /^(\w+)\(/.exec(raw.premises)?.[1] ?? ''
    const number = raw['rule-number']?.replace(/[()]/g, '') ?? ''
    const rule = rules.find(
      (r) =>
        r['rule-number'].replace(/[()]/g, '') === number &&
        r.rule.startsWith(`${relation}(`),
    )
    return {
      kind: 'derived',
      text: raw.premises,
      ruleNumber: number,
      rule: rule ? cleanRule(rule.rule) : undefined,
      children: (raw.children ?? []).map((c) => convert(c, rules)),
    }
  }
  const axiom = raw.axiom ?? ''
  if (axiom === 'Tuple not found')
    return { kind: 'missing', text: axiom, children: [] }
  if (axiom.startsWith('!'))
    return { kind: 'negation', text: axiom, children: [] }
  if (/^\w+\(/.test(axiom)) return { kind: 'fact', text: axiom, children: [] }
  return { kind: 'constraint', text: axiom, children: [] }
}

/**
 * program.dl with a single `.output`: the relation being explained. In provenance mode Soufflé
 * writes every output relation with its proof annotations, which costs seconds for 200 relations;
 * with no output at all it computes nothing (dead relations are removed). One output keeps exactly
 * the relation asked about and everything it depends on.
 */
function explainProgram(runDir: string, relation: string): string {
  if (!/^\w+$/.test(relation)) throw new Error(`bad relation name ${relation}`)
  const path = join(runDir, `program.explain.${relation}.dl`)
  if (!existsSync(path)) {
    const text = readFileSync(join(runDir, 'program.dl'), 'utf8')
      .split('\n')
      .filter((line) => !/^\.output\b/.test(line))
      .join('\n')
    writeFileSync(path, `${text}\n.output ${relation}\n`)
  }
  return path
}

export function explainTuple(
  souffle: string,
  runDir: string,
  atom: string,
): ExplainResult {
  const t0 = performance.now()
  const relation = /^(\w+)\(/.exec(atom)?.[1] ?? ''
  const run = spawnSync(
    souffle,
    [
      '--no-preprocessor',
      '-t',
      'explain',
      '-F',
      join(runDir, 'facts'),
      '-D',
      join(runDir, 'derived'),
      explainProgram(runDir, relation),
    ],
    {
      encoding: 'utf8',
      input: `setdepth 60\nformat json\nexplain ${atom}\nexit\n`,
      maxBuffer: 64 * 1024 * 1024,
    },
  )
  if (run.error)
    throw new Error(`could not run ${souffle}: ${run.error.message}`)
  if (run.status !== 0)
    throw new Error(
      `souffle -t explain exited with ${run.status}: ${run.stderr}`,
    )
  const json = firstJsonObject(run.stdout)
  if (!json)
    throw new Error(`no proof in Soufflé output:\n${run.stdout.slice(0, 2000)}`)
  const parsed = JSON.parse(json) as { proof: RawProof; rules?: RawRule[] }
  return {
    atom,
    proof: convert(parsed.proof, parsed.rules ?? []),
    ms: performance.now() - t0,
  }
}
