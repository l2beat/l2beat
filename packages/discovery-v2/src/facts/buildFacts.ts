/**
 * `facts.json` for one prepared contract: compile each source, extract the
 * relations, run the rules, name the results.
 *
 * Each source (proxy, implementation) is analysed on its own with its own
 * compiler, because they were verified separately and their ASTs share no
 * ids. The analysed contract of a source is the one the explorer named,
 * which is how a flattened file with fifty contracts yields the state of
 * one. A source that fails to compile or to analyse is recorded with its
 * error rather than failing the whole file: partial facts are still facts,
 * and the prompt tells the model which source it has none for.
 */
import fs from 'fs'
import path from 'path'
import { AbiIndex } from '../abi/AbiIndex'
import type { Facts, FactsSource, FactsVariable } from '../types/Facts'
import type { Prepared, PreparedSource } from '../types/Prepared'
import { type AstRelations, extractRelations } from './astFacts'
import {
  type AstCompilation,
  compileAst,
  loadCompiler,
  type SolcCompiler,
} from './solc'
import {
  type Relations,
  type Row,
  runSouffle,
  type SouffleOptions,
} from './souffle'

export const FACTS_OUTPUTS = [
  'varWriter',
  'constructorWrite',
  'guard',
  'writerEmits',
  'varReader',
  'neverEmitted',
  'entryPoint',
] as const

export interface BuildFactsDeps {
  /** Replaces the download-and-load path, for tests with a bundled compiler. */
  loadCompiler?: (version: string) => Promise<SolcCompiler>
  souffle?: SouffleOptions
}

export function rulesFile(): string {
  return path.join(__dirname, 'rules', 'facts.dl')
}

export async function buildFacts(
  prepared: Prepared,
  deps: BuildFactsDeps = {},
): Promise<Facts> {
  const sources: FactsSource[] = []
  for (const source of prepared.sources) {
    sources.push(await analyseSource(source, prepared, deps))
  }
  return { version: 1, sources }
}

async function analyseSource(
  source: PreparedSource,
  prepared: Prepared,
  deps: BuildFactsDeps,
): Promise<FactsSource> {
  const base = {
    name: source.name,
    address: source.address,
    compilerVersion: source.solidityVersion,
    variables: [],
    neverEmitted: [],
  }
  if (source.flattened.trim() === '') {
    return { ...base, error: 'no verified source' }
  }
  try {
    const compiler = await (deps.loadCompiler ?? loadCompiler)(
      source.solidityVersion,
    )
    const compiled = compileAst(
      compiler,
      `${source.name}.sol`,
      source.flattened,
    )
    const relations = extractRelations(compiled.ast)
    const main = mainContractId(relations, source.name)
    if (main === undefined) {
      return {
        ...base,
        error: `no contract named ${source.name} in the source`,
      }
    }
    const derived = await runSouffle(
      rulesFile(),
      { ...relations, mainContract: [[main]] },
      FACTS_OUTPUTS,
      deps.souffle,
    )
    return {
      ...base,
      compilerVersion: compiled.compilerVersion,
      evmVersion: compiled.evmVersion,
      ...nameResults(
        relations,
        derived,
        abiIndexFor(prepared, source, compiled),
      ),
    }
  } catch (error) {
    return {
      ...base,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

function mainContractId(
  relations: AstRelations,
  name: string,
): number | undefined {
  const candidates = relations.contract.filter(([, n]) => n === name)
  // The last definition wins, as it does for the compiler when a flattened file repeats a name.
  return candidates[candidates.length - 1]?.[0]
}

function abiIndexFor(
  prepared: Prepared,
  source: PreparedSource,
  _compiled: AstCompilation,
): AbiIndex {
  return AbiIndex.from(prepared.abis[source.address] ?? prepared.abi)
}

/**
 * Ids become names here and only here. Functions are spelled as their ABI
 * signature when one matches by name and parameter count, so the model can
 * line a writer up with a worklist item; otherwise the Solidity name.
 */
function nameResults(
  relations: AstRelations,
  derived: Relations,
  abi: AbiIndex,
): Pick<FactsSource, 'variables' | 'neverEmitted'> {
  const variables = new Map(relations.stateVariable.map((row) => [row[0], row]))
  const functions = new Map(
    relations.functionDefinition.map((row) => [row[0], row]),
  )
  const modifiers = new Map(
    relations.modifierDefinition.map((row) => [row[0], row[1]]),
  )
  const events = new Map(
    relations.eventDefinition.map((row) => [row[0], row[2]]),
  )
  const contracts = new Map(relations.contract.map((row) => [row[0], row[1]]))
  const functionName = (id: number): string => {
    const definition = functions.get(id)
    if (definition === undefined) return `#${id}`
    const fragment = abi.functions.find((f) => f.name === definition[1])
    return fragment === undefined ? definition[1] : fragment.format('sighash')
  }
  const grouped = <T>(
    rows: Row[],
    key: (row: Row) => number,
    value: (row: Row) => T,
  ) => {
    const map = new Map<number, T[]>()
    for (const row of rows) {
      map.set(key(row), [...(map.get(key(row)) ?? []), value(row)])
    }
    return map
  }
  const writersOf = grouped(
    derived.varWriter ?? [],
    (r) => r[0] as number,
    (r) => r[1] as number,
  )
  const readersOf = grouped(
    derived.varReader ?? [],
    (r) => r[0] as number,
    (r) => r[1] as number,
  )
  const guardsOf = grouped(
    derived.guard ?? [],
    (r) => r[0] as number,
    (r) => r[1] as number,
  )
  const emitsOf = grouped(
    derived.writerEmits ?? [],
    (r) => r[0] as number,
    (r) => r[1] as number,
  )
  const inConstructor = new Set(
    (derived.constructorWrite ?? []).map((r) => r[0] as number),
  )

  const named: FactsVariable[] = []
  const scoped = new Set([
    ...writersOf.keys(),
    ...readersOf.keys(),
    ...inConstructor,
  ])
  for (const id of [...scoped].sort((a, b) => a - b)) {
    const variable = variables.get(id)
    if (variable === undefined) continue
    const [, name, type, contract, visibility] = variable
    named.push({
      name,
      type,
      declaredIn: contracts.get(contract) ?? '?',
      visibility,
      writers: unique(writersOf.get(id) ?? [])
        .map((f) => ({
          function: functionName(f),
          modifiers: unique(guardsOf.get(f) ?? [])
            .map((m) => modifiers.get(m) ?? `#${m}`)
            .sort(),
          events: unique(emitsOf.get(f) ?? [])
            .map((e) => events.get(e) ?? `#${e}`)
            .sort(),
        }))
        .sort((a, b) => a.function.localeCompare(b.function)),
      writtenInConstructor: inConstructor.has(id),
      readers: unique(readersOf.get(id) ?? [])
        .map(functionName)
        .sort(),
    })
  }
  return {
    variables: named.sort((a, b) => a.name.localeCompare(b.name)),
    neverEmitted: unique(
      (derived.neverEmitted ?? []).map((r) => r[0] as number),
    )
      .map((e) => events.get(e) ?? `#${e}`)
      .sort(),
  }
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)]
}

export function readFacts(file: string): Facts | undefined {
  if (!fs.existsSync(file)) {
    return undefined
  }
  return JSON.parse(fs.readFileSync(file, 'utf8')) as Facts
}
