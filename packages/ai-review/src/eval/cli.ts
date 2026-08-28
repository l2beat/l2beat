import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildDataset } from './buildDataset.js'
import { GithubClient } from './github.js'
import { CachedJudge } from './judge/CachedJudge.js'
import { CodexJudgeEngine } from './judge/CodexJudgeEngine.js'
import { ApiLinearSource, FileLinearSource } from './linear.js'
import { appendMetricsRow, datasetHash } from './metrics.js'
import { aggregate, aggregateByStratum, median, scorePr } from './score.js'
import { findCandidates, stratify } from './select.js'
import type {
  Dataset,
  JudgeUsage,
  LinearSnapshot,
  MetricsRow,
} from './types.js'

const REPO = 'l2beat/l2beat'
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const EVAL_DIR = join(ROOT, '.ai-review/eval')
const DATASET_PATH = join(EVAL_DIR, 'dataset.json')
const METRICS_PATH = join(EVAL_DIR, 'metrics.jsonl')
const OUT_DIR = join(ROOT, 'packages/ai-review/out')

const log = (message: string) => process.stderr.write(`${message}\n`)

const [command = 'help', ...rest] = process.argv.slice(2)
const flags = parseFlags(rest)

switch (command) {
  case 'select':
    await select()
    break
  case 'build':
    await build()
    break
  case 'baseline':
    await baseline()
    break
  default:
    log(`usage:
  eval select [--scan 300] [--per-stratum 17] [--min-human 1]   print candidate PR numbers
  eval build --prs 1,2,3 [--linear-snapshots file.json]          write ${DATASET_PATH}
  eval baseline [--limit N] [--model M] [--concurrency 4] [--dry-run]  judge codex findings, append metrics row`)
}

async function select() {
  const gh = new GithubClient(REPO)
  const per = Number(flags['per-stratum'] ?? 17)
  const candidates = await findCandidates(
    gh,
    Number(flags.scan ?? 300),
    Number(flags['min-human'] ?? 1),
    log,
  )
  log(
    `candidates: ${candidates.length} (backend=${count(candidates, 'backend')} frontend=${count(candidates, 'frontend')} config=${count(candidates, 'config')} other=${count(candidates, 'other')})`,
  )
  const picked = stratify(candidates, {
    backend: per,
    frontend: per,
    config: per,
  })
  for (const c of picked) {
    log(`#${c.pr} ${c.stratum} human=${c.humanComments} merged=${c.mergedAt}`)
  }
  process.stdout.write(`${picked.map((c) => c.pr).join(',')}\n`)
}

async function build() {
  const prs = String(flags.prs ?? '')
    .split(',')
    .filter(Boolean)
    .map(Number)
  if (prs.length === 0) throw new Error('--prs is required')

  const apiKey = process.env.LINEAR_API_KEY
  const snapshotsFile = flags['linear-snapshots']
  const linear = snapshotsFile
    ? new FileLinearSource(
        JSON.parse(readFileSync(String(snapshotsFile), 'utf8')) as Record<
          string,
          LinearSnapshot
        >,
      )
    : apiKey
      ? new ApiLinearSource(apiKey)
      : new FileLinearSource({})
  if (!snapshotsFile && !apiKey) {
    log(
      'no LINEAR_API_KEY or --linear-snapshots: linear snapshots will be null',
    )
  }

  const dataset = await buildDataset(new GithubClient(REPO), linear, prs, log)
  mkdirSync(EVAL_DIR, { recursive: true })
  writeFileSync(DATASET_PATH, `${JSON.stringify(dataset, null, 2)}\n`)
  log(`wrote ${dataset.entries.length} entries to ${DATASET_PATH}`)
}

async function baseline() {
  const dataset = JSON.parse(readFileSync(DATASET_PATH, 'utf8')) as Dataset
  const limit = flags.limit ? Number(flags.limit) : undefined
  const entries = dataset.entries.slice(0, limit)
  const model = flags.model ? String(flags.model) : undefined
  const engine = new CodexJudgeEngine(model)
  const judge = new CachedJudge(engine, join(OUT_DIR, 'judge-cache'))
  const runId = new Date().toISOString().replace(/[:.]/g, '-')
  const runDir = join(OUT_DIR, runId)
  mkdirSync(runDir, { recursive: true })

  const judgements = await mapConcurrently(
    entries,
    Number(flags.concurrency ?? 4),
    async (entry) => {
      const judgement = await judge.judge(entry)
      const matches = judgement.verdicts.filter((v) => v.match).length
      log(
        `#${entry.pr} pairs=${judgement.verdicts.length} matches=${matches} missing=${judgement.missingPairs}${judgement.cached ? ' (cached)' : ''}`,
      )
      return judgement
    },
  )
  const usage: JudgeUsage = {
    inputTokens: 0,
    cachedInputTokens: 0,
    outputTokens: 0,
  }
  let judgeLatencyMs = 0
  for (const judgement of judgements) {
    if (judgement.usage) {
      usage.inputTokens += judgement.usage.inputTokens
      usage.cachedInputTokens += judgement.usage.cachedInputTokens
      usage.outputTokens += judgement.usage.outputTokens
    }
    judgeLatencyMs += judgement.latencyMs
  }
  writeFileSync(
    join(runDir, 'judgements.json'),
    JSON.stringify(judgements, null, 2),
  )

  const scores = entries.map((entry, i) => {
    const judgement = judgements[i]
    if (!judgement) throw new Error('missing judgement')
    return scorePr(entry, judgement)
  })
  const row: MetricsRow = {
    timestamp: new Date().toISOString(),
    runId,
    subject: 'codex-baseline',
    datasetHash: datasetHash({ ...dataset, entries }),
    total: aggregate(scores),
    byStratum: aggregateByStratum(scores),
    subjectLatencyMsMedian: median(
      entries.flatMap((e) =>
        e.codexReview?.latencyMs !== undefined ? [e.codexReview.latencyMs] : [],
      ),
    ),
    judge: {
      engine: engine.name,
      model,
      usage,
      latencyMs: judgeLatencyMs,
      cachedPrs: judgements.filter((j) => j.cached).length,
    },
  }
  writeFileSync(join(runDir, 'metrics.json'), JSON.stringify(row, null, 2))
  log(JSON.stringify(row.total))
  if (flags['dry-run'] || limit !== undefined) {
    log(`partial/dry run: metrics row written to ${runDir} only`)
    return
  }
  if (!existsSync(METRICS_PATH)) writeFileSync(METRICS_PATH, '')
  appendMetricsRow(METRICS_PATH, row)
  log(`appended metrics row to ${METRICS_PATH}`)
}

async function mapConcurrently<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const i = next++
      const item = items[i] as T
      results[i] = await fn(item)
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker))
  return results
}

function parseFlags(args: string[]): Record<string, string | true> {
  const result: Record<string, string | true> = {}
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (!arg?.startsWith('--')) continue
    const next = args[i + 1]
    if (next !== undefined && !next.startsWith('--')) {
      result[arg.slice(2)] = next
      i++
    } else {
      result[arg.slice(2)] = true
    }
  }
  return result
}

function count<T extends { stratum: string }>(items: T[], stratum: string) {
  return items.filter((i) => i.stratum === stratum).length
}
