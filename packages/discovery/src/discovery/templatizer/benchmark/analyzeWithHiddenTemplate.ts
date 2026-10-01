/**
 * One benchmarked contract, for real: its committed template hidden, a
 * templatizer asked to author one, the analyzer run with whatever it wrote.
 *
 * Isolation is a throwaway copy of `_templates`, not a flag on
 * `TemplateService`: the analyzer, the templatizer and the writer then run
 * exactly the code a researcher's `--ai` run does, and whatever the
 * templatizer writes lands in the copy, never in the repo. Only the hidden
 * template's own files go; directories stay, because templates nest and a
 * sibling nested below the hidden one is a different template.
 *
 * The templatizer gets no previous templates, so it always authors from
 * scratch: the freeze path would hand the model the very fields it is
 * measured on.
 */
import type { Logger } from '@l2beat/backend-tools'
import { withoutUndefinedKeys } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { AddressAnalyzer, type Analysis } from '../../analysis/AddressAnalyzer'
import { TEMPLATES_PATH, TemplateService } from '../../analysis/TemplateService'
import { HandlerExecutor } from '../../handlers/HandlerExecutor'
import type { IProvider } from '../../provider/IProvider'
import { ProxyDetector } from '../../proxies/ProxyDetector'
import type { ProxyResult } from '../../proxies/types'
import { SourceCodeService } from '../../source/SourceCodeService'
import { trailDirectory } from '../artifacts'
import type { ModelClient } from '../model/ModelClient'
import { Templatizer } from '../Templatizer'
import type { Values } from './compare'
import type { BenchmarkProject, TemplatedEntry } from './loadProject'
import type { TokenUsage, TrailSummary } from './types'

export interface HiddenTemplateRun {
  provider: IProvider
  project: BenchmarkProject
  entry: TemplatedEntry
}

/** The template the analysis ran with; the text only when this run authored it. */
export type UsedTemplate =
  | { kind: 'authored'; id: string; text: string }
  | { kind: 'matched'; id: string }

export interface HiddenTemplateResult {
  values: Values
  /** What the proxy detector produced, so attribution can tell `GnosisSafe_modules` from a getter. */
  proxyValueNames: string[]
  /** Undefined when nothing matched and nothing was authored. */
  template?: UsedTemplate
  /** Absent when the templatizer made no model call. */
  trail?: TrailSummary
}

export interface HiddenTemplateEnv {
  discoveryPath: string
  artifactsRoot: string
  model: ModelClient
  modelLabel: string
  effort?: string
  maxRounds?: number
  logger: Logger
  now?: () => Date
}

export async function analyzeWithHiddenTemplate(
  env: HiddenTemplateEnv,
  { provider, project, entry }: HiddenTemplateRun,
): Promise<HiddenTemplateResult> {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'templatizer-benchmark-'))
  const trail = trailDirectory(env.artifactsRoot, project.name, entry.address)
  try {
    copyTemplatesHiding(
      path.join(env.discoveryPath, TEMPLATES_PATH),
      path.join(root, TEMPLATES_PATH),
      entry.template,
    )
    // A summary left by an earlier run into the same output directory would
    // be read as this run's rounds and tokens.
    fs.rmSync(trail, { recursive: true, force: true })
    const templateService = new TemplateService(root)
    const proxyDetector = new RecordingProxyDetector()
    const analyzer = buildAnalyzer(env, project, templateService, proxyDetector)
    const analysis = await analyzer.analyze(
      provider,
      entry.address,
      project.entryConfig(entry.address),
      undefined,
    )
    return {
      values: valuesOf(analysis),
      proxyValueNames: proxyDetector.valueNames,
      template: usedTemplate(
        env.discoveryPath,
        templateService,
        analysis,
        entry,
      ),
      trail: readTrailSummary(trail),
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
}

function buildAnalyzer(
  env: HiddenTemplateEnv,
  project: BenchmarkProject,
  templateService: TemplateService,
  proxyDetector: ProxyDetector,
): AddressAnalyzer {
  const handlerExecutor = new HandlerExecutor()
  const templatizer = new Templatizer(
    templateService,
    handlerExecutor,
    {
      project: project.name,
      model: env.model,
      modelLabel: env.modelLabel,
      effort: env.effort,
      maxRounds: env.maxRounds,
      artifactsRoot: env.artifactsRoot,
      previousTemplates: {},
      // A contract the model cannot author is what the benchmark measures.
      onFailure: 'leave-untemplatized',
      now: env.now,
    },
    env.logger,
  )
  return new AddressAnalyzer(
    proxyDetector,
    new SourceCodeService(),
    handlerExecutor,
    templateService,
    templatizer,
  )
}

/** Copies `_templates` to `target`, then removes the hidden template's files (not its subdirectories). */
export function copyTemplatesHiding(
  source: string,
  target: string,
  hidden: string,
): void {
  fs.cpSync(source, target, { recursive: true })
  const directory = path.join(target, hidden)
  if (!fs.existsSync(directory)) {
    throw new Error(`Template ${hidden} does not exist in ${source}`)
  }
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!item.isDirectory()) {
      fs.rmSync(path.join(directory, item.name))
    }
  }
}

/**
 * The analyzer merges proxy values into `values`, so the detector's own
 * result is the only record of which names it produced.
 */
class RecordingProxyDetector extends ProxyDetector {
  valueNames: string[] = []

  override async detectProxy(
    ...args: Parameters<ProxyDetector['detectProxy']>
  ): Promise<ProxyResult> {
    const result = await super.detectProxy(...args)
    this.valueNames = Object.keys(result.values)
    return result
  }
}

/** Through JSON, like the committed side: `discovered.json` cannot hold an undefined value. */
function valuesOf(analysis: Analysis): Values {
  return analysis.type === 'Reference'
    ? {}
    : withoutUndefinedKeys(analysis.values)
}

/**
 * Authored is anything that is not a committed template: the hidden id
 * itself (its files were deleted, so the templatizer may reuse the name) or
 * an id that exists only in the copy.
 */
function usedTemplate(
  discoveryPath: string,
  copy: TemplateService,
  analysis: Analysis,
  entry: TemplatedEntry,
): UsedTemplate | undefined {
  const id =
    analysis.type === 'Reference'
      ? undefined
      : analysis.extendedTemplate?.template
  if (id === undefined) {
    return undefined
  }
  const committed = new TemplateService(discoveryPath)
  if (id !== entry.template && committed.exists(id)) {
    return { kind: 'matched', id }
  }
  return { kind: 'authored', id, text: copy.readTemplateFile(id) ?? '' }
}

const Usage = v.object({
  inputTokens: v.number().optional(),
  cachedInputTokens: v.number().optional(),
  outputTokens: v.number().optional(),
  reasoningOutputTokens: v.number().optional(),
})

const Round = v.object({
  durationMs: v.number().optional(),
  refused: v.string().optional(),
  usage: Usage.optional(),
})

/** The part of the loop's `summary.json` the benchmark reads; the loop writes more. */
const SummaryFile = v.object({
  status: v.string(),
  failure: v.string().optional(),
  model: v.string().optional(),
  rounds: v.array(Round).default([]),
})

export function readTrailSummary(directory: string): TrailSummary | undefined {
  const file = path.join(directory, 'summary.json')
  if (!fs.existsSync(file)) {
    return undefined
  }
  const summary = SummaryFile.parse(JSON.parse(fs.readFileSync(file, 'utf8')))
  return {
    status: summary.status,
    failure: summary.failure,
    model: summary.model,
    rounds: summary.rounds.length,
    tokens: sumUsage(summary.rounds.map((round) => round.usage ?? {})),
    modelMs: summary.rounds.reduce(
      (sum, round) => sum + (round.durationMs ?? 0),
      0,
    ),
    lastRefusal: summary.rounds.at(-1)?.refused,
  }
}

function sumUsage(usages: v.infer<typeof Usage>[]): TokenUsage {
  return usages.reduce<TokenUsage>(
    (sum, usage) => ({
      input: sum.input + (usage.inputTokens ?? 0),
      cached: sum.cached + (usage.cachedInputTokens ?? 0),
      output: sum.output + (usage.outputTokens ?? 0),
      reasoning: sum.reasoning + (usage.reasoningOutputTokens ?? 0),
    }),
    { input: 0, cached: 0, output: 0, reasoning: 0 },
  )
}
