import type { CallKind } from './oracle'
import type { BenchResult } from './runBench'
import type { JudgedSite, Verdict } from './score'
import type { ReferenceScore } from './scoreReferences'

const IN_CONTRACT: CallKind[] = ['internal', 'super', 'library', 'static']
const GROUPS: { name: string; includes: (j: JudgedSite) => boolean }[] = [
  { name: 'in-contract', includes: (j) => IN_CONTRACT.includes(j.site.call) },
  {
    name: 'cross-contract',
    includes: (j) =>
      j.site.call === 'external' && j.site.truth.kind !== 'outside',
  },
  {
    name: '  target outside project',
    includes: (j) => j.site.truth.kind === 'outside',
  },
  {
    name: 'references (not calls)',
    includes: (j) => j.site.call === 'reference',
  },
]
const SCORED: Verdict[] = ['correct', 'almost', 'wrong', 'miss']

export function formatBench(results: BenchResult[]): string {
  const lines = [
    `${'project / calls'.padEnd(28)}${'judged'.padStart(7)}${SCORED.map((v) => v.padStart(9)).join('')}${'dynamic'.padStart(9)}${'guessed'.padStart(9)}${'unknown'.padStart(9)}`,
  ]
  const all = results.flatMap((r) => r.judged)
  for (const result of results) {
    lines.push(
      `${result.project} (${result.filesUnique} unique of ${result.filesTotal} flats, ${result.compileFailures.length} do not compile)`,
    )
    lines.push(...groupRows(result.judged))
  }
  if (results.length > 1) {
    lines.push('all projects', ...groupRows(all))
  }
  lines.push('', 'find references (cursor on each declaration)')
  for (const result of results) {
    lines.push(referenceRow(result.project, result.references))
  }
  if (results.length > 1) {
    lines.push(
      referenceRow(
        'all projects',
        mergeScores(results.map((r) => r.references)),
      ),
    )
  }
  return lines.join('\n')
}

function referenceRow(project: string, score: ReferenceScore): string {
  const percent = (part: number, whole: number) =>
    whole === 0 ? '-' : `${((100 * part) / whole).toFixed(2)}%`
  const sorted = [...score.queryMs].sort((a, b) => a - b)
  const p50 = sorted[Math.floor(sorted.length / 2)] ?? 0
  const p99 = sorted[Math.floor(sorted.length * 0.99)] ?? 0
  return [
    `  ${project.padEnd(14)}`,
    `declarations ${score.declarations} (exact ${percent(score.exact, score.declarations)}, not queried ${score.notQueried})`,
    `references ${score.truthReferences}: found ${percent(score.found, score.truthReferences)}, missing ${score.missing}, wrong ${score.wrong}, unverified ${score.unverified}, elsewhere ${score.elsewhere}`,
    `query p50 ${p50.toFixed(2)}ms p99 ${p99.toFixed(2)}ms max ${(sorted[sorted.length - 1] ?? 0).toFixed(1)}ms`,
  ].join('  ')
}

function mergeScores(scores: ReferenceScore[]): ReferenceScore {
  const sum = (pick: (s: ReferenceScore) => number) =>
    scores.reduce((total, s) => total + pick(s), 0)
  return {
    declarations: sum((s) => s.declarations),
    notQueried: sum((s) => s.notQueried),
    exact: sum((s) => s.exact),
    truthReferences: sum((s) => s.truthReferences),
    found: sum((s) => s.found),
    missing: sum((s) => s.missing),
    wrong: sum((s) => s.wrong),
    unverified: sum((s) => s.unverified),
    elsewhere: sum((s) => s.elsewhere),
    queryMs: scores.flatMap((s) => s.queryMs),
    samples: [],
  }
}

function groupRows(judged: JudgedSite[]): string[] {
  return GROUPS.map(({ name, includes }) => {
    const sites = judged.filter(includes)
    const count = (v: Verdict) => sites.filter((j) => j.verdict === v).length
    const judgedCount = SCORED.reduce((sum, v) => sum + count(v), 0)
    const percent = (v: Verdict) =>
      judgedCount === 0
        ? '-'
        : `${((100 * count(v)) / judgedCount).toFixed(1)}%`
    return `  ${name.padEnd(26)}${String(judgedCount).padStart(7)}${SCORED.map((v) => percent(v).padStart(9)).join('')}${String(count('dynamic: honest') + count('dynamic: guessed')).padStart(9)}${String(count('dynamic: guessed')).padStart(9)}${String(count('oracle unknown')).padStart(9)}`
  })
}

export function formatFindings(result: BenchResult): string {
  return result.judged
    .map(({ site, verdict, location, expected, ours }) =>
      [verdict, site.call, location, expected, ours.join(' | ')].join('\t'),
    )
    .join('\n')
}
