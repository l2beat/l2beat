import type {
  AggregateScore,
  DatasetEntry,
  PrJudgement,
  PrScore,
  Stratum,
} from './types.js'

export function scorePr(entry: DatasetEntry, judgement: PrJudgement): PrScore {
  const matchedHuman = new Set<number>()
  const matchedFindings = new Set<number>()
  for (const v of judgement.verdicts) {
    if (!v.match) continue
    matchedHuman.add(v.humanCommentId)
    matchedFindings.add(v.findingId)
  }
  return {
    pr: entry.pr,
    stratum: entry.stratum,
    humanComments: entry.humanComments.length,
    findings: entry.codexFindings.length,
    matchedHuman: matchedHuman.size,
    matchedFindings: matchedFindings.size,
  }
}

export function aggregate(scores: PrScore[]): AggregateScore {
  const sum = (f: (s: PrScore) => number) =>
    scores.reduce((acc, s) => acc + f(s), 0)
  const humanComments = sum((s) => s.humanComments)
  const findings = sum((s) => s.findings)
  const matchedHuman = sum((s) => s.matchedHuman)
  const matchedFindings = sum((s) => s.matchedFindings)
  return {
    prs: scores.length,
    humanComments,
    findings,
    matchedHuman,
    matchedFindings,
    recall: ratio(matchedHuman, humanComments),
    precision: ratio(matchedFindings, findings),
    noise: ratio(findings, scores.length),
  }
}

export function aggregateByStratum(
  scores: PrScore[],
): Partial<Record<Stratum, AggregateScore>> {
  const result: Partial<Record<Stratum, AggregateScore>> = {}
  for (const stratum of new Set(scores.map((s) => s.stratum))) {
    result[stratum] = aggregate(scores.filter((s) => s.stratum === stratum))
  }
  return result
}

export function median(values: number[]): number | undefined {
  if (values.length === 0) return undefined
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1
    ? sorted[mid]
    : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2
}

function ratio(a: number, b: number): number {
  return b === 0 ? 0 : round(a / b)
}

function round(value: number): number {
  return Math.round(value * 10000) / 10000
}
