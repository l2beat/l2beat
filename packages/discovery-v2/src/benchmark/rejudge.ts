/**
 * Re-compare a finished benchmark run without re-running any pipeline.
 *
 * The verdict rules change (a new match kind, a new normalisation) more
 * often than the extractor does, and every contract's `entry.json` is still
 * on disk under `contracts/<address>/`. Re-judging reads those entries and
 * V1's, recomputes fields, facts and counts, and keeps everything the
 * comparison cannot know again (plan source, rounds, tokens, timing), so
 * old runs stay comparable with new ones under the same rules at no cost.
 */
import type { EntryParameters } from '@l2beat/discovery'
import fs from 'fs'
import path from 'path'
import { FILE_NAMES, readJson } from '../commands/files'
import { attributeV1Field } from './attribution'
import { compareFacts, compareValues, countVerdicts } from './compare'
import type { BenchmarkProject } from './loadProject'
import {
  addressOf,
  CONTRACTS_DIR,
  proxyValueNames,
  totalsOf,
} from './runBenchmark'
import type { ContractBenchmark, ProjectBenchmark } from './types'

export function rejudgeBenchmark(
  report: ProjectBenchmark,
  project: BenchmarkProject,
  outDir: string,
): ProjectBenchmark {
  const v1 = new Map<string, EntryParameters>(
    project.entries.map((e) => [e.address, e]),
  )
  const contracts = report.contracts.map((contract) => {
    const entry = v1.get(contract.address)
    const entryFile = path.join(
      outDir,
      CONTRACTS_DIR,
      addressOf(contract.address),
      FILE_NAMES.entry,
    )
    if (
      contract.status !== 'compared' ||
      entry === undefined ||
      !fs.existsSync(entryFile)
    ) {
      return contract
    }
    return rejudgeContract(contract, entry, project, entryFile)
  })
  return { ...report, contracts, totals: totalsOf(contracts) }
}

function rejudgeContract(
  contract: ContractBenchmark,
  entry: EntryParameters,
  project: BenchmarkProject,
  entryFile: string,
): ContractBenchmark {
  const v2 = readJson(entryFile) as EntryParameters
  const config = project.effectiveConfig(entry)
  const proxyNames = new Set([
    ...Object.keys(v2.values ?? {}).filter((name) => name.startsWith('$')),
    ...proxyValueNames(path.dirname(entryFile)),
  ])
  const fields = compareValues(entry.values ?? {}, v2.values ?? {}, {
    attribute: (name) => attributeV1Field(name, config, proxyNames),
    ignoreMethods: config.ignoreMethods,
  })
  return {
    ...contract,
    fields,
    facts: compareFacts(entry, v2),
    counts: countVerdicts(fields),
  }
}
