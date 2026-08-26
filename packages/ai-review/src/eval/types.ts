export type Stratum = 'backend' | 'frontend' | 'config' | 'other'

export interface ReviewComment {
  id: number
  author: string
  path?: string
  line?: number
  body: string
  url: string
  createdAt: string
}

export interface CodexFinding extends ReviewComment {
  priority?: 'P1' | 'P2' | 'P3'
}

export interface LinearSnapshot {
  snapshotAt: string
  issue: {
    identifier: string
    title: string
    description: string
    status: string
    labels: string[]
    url: string
  }
  project?: {
    name: string
    summary: string
    description: string
  }
  initiatives: { name: string; description: string }[]
}

export interface DatasetEntry {
  pr: number
  url: string
  title: string
  author: string
  mergedAt: string
  headSha: string
  baseSha: string
  mergeCommitSha: string
  stratum: Stratum
  changedFiles: string[]
  linearIssueId?: string
  /** null = no linked issue, or the issue could not be resolved at build time */
  linear: LinearSnapshot | null
  humanComments: ReviewComment[]
  codexFindings: CodexFinding[]
  codexReview?: {
    submittedAt: string
    reviewedCommitSha: string
    /** review submitted_at minus reviewed commit's committer date */
    latencyMs?: number
  }
}

export interface Dataset {
  version: 1
  repo: string
  builtAt: string
  entries: DatasetEntry[]
}

export interface Verdict {
  findingId: number
  humanCommentId: number
  match: boolean
  reason: string
}

export interface JudgeUsage {
  inputTokens: number
  cachedInputTokens: number
  outputTokens: number
}

export interface PrJudgement {
  pr: number
  verdicts: Verdict[]
  /** pairs the judge omitted; scored as no-match */
  missingPairs: number
  usage?: JudgeUsage
  latencyMs: number
  cached: boolean
}

export interface PrScore {
  pr: number
  stratum: Stratum
  humanComments: number
  findings: number
  matchedHuman: number
  matchedFindings: number
}

export interface AggregateScore {
  prs: number
  humanComments: number
  findings: number
  matchedHuman: number
  matchedFindings: number
  recall: number
  precision: number
  noise: number
}

export interface MetricsRow {
  timestamp: string
  runId: string
  subject: string
  datasetHash: string
  total: AggregateScore
  byStratum: Partial<Record<Stratum, AggregateScore>>
  subjectLatencyMsMedian?: number
  judge: {
    engine: string
    model?: string
    usage: JudgeUsage
    latencyMs: number
    cachedPrs: number
  }
}
