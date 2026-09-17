import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { sha256 } from '../deployed/format.js'
import {
  comparableLines,
  comparableText,
  countLines,
  normalizeSource,
} from '../diffing/normalize.js'
import { type ExtractedUnit, extractUnits } from '../solidity/extractUnits.js'

/**
 * A unit prepared for comparison: normalized text, comparable text (comments
 * and require messages removed) and its hash, which identifies the unit
 * regardless of where it was found.
 */
export interface PreparedUnit {
  name: string
  kind: ExtractedUnit['kind']
  startLine: number
  endLine: number
  signatures: string[]
  /** Normalized source, used for the displayed diff. */
  normalized: string
  /** sha256 of the comparable text. */
  unitHash: string
  /** Comparable non-empty lines joined, used for similarity. */
  comparableLines: string
}

export function prepareUnit(unit: ExtractedUnit): PreparedUnit {
  const normalized = normalizeSource(unit.source)
  return {
    name: unit.name,
    kind: unit.kind,
    startLine: unit.startLine,
    endLine: unit.endLine,
    signatures: unit.signatures,
    normalized,
    unitHash: sha256(comparableText(normalized)),
    comparableLines: joinComparableLines(normalized),
  }
}

/** A non-Solidity source file treated as a single unit named by its basename. */
export function wholeFileUnit(name: string, content: string): ExtractedUnit {
  const normalized = normalizeSource(content)
  return {
    name,
    kind: 'program',
    startLine: 1,
    endLine: Math.max(1, countLines(normalized)),
    source: normalized,
    signatures: [],
  }
}

export function joinComparableLines(normalized: string): string {
  return comparableLines(normalized)
    .filter((line) => line !== '')
    .join('\n')
}

/** Splits one file into prepared units; non-Solidity files are one unit. */
export function prepareFile(basename: string, content: string): PreparedUnit[] {
  if (basename.endsWith('.sol')) {
    return extractUnits(content).map(prepareUnit)
  }
  return [prepareUnit(wholeFileUnit(basename, content))]
}

/**
 * Disk cache of prepared units keyed by the content hash of the audited file
 * (the manifest's post-format sha256 when available). Reruns only parse files
 * that changed.
 */
export class PreparedUnitCache {
  constructor(private readonly dir: string) {
    mkdirSync(dir, { recursive: true })
  }

  get(fileHash: string): PreparedUnit[] | undefined {
    const file = this.path(fileHash)
    if (!existsSync(file)) return undefined
    try {
      return JSON.parse(readFileSync(file, 'utf8')) as PreparedUnit[]
    } catch {
      return undefined
    }
  }

  set(fileHash: string, units: PreparedUnit[]) {
    writeFileSync(this.path(fileHash), JSON.stringify(units))
  }

  private path(fileHash: string) {
    return path.join(this.dir, `${fileHash}.json`)
  }
}
