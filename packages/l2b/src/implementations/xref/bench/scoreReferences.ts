import type { FlatWorkspace } from '../FlatWorkspace'
import { findReferences, wordOccurrences } from '../findReferences'
import type { OracleSite, TruthTarget } from './oracle'

export interface ReferenceScore {
  declarations: number
  // Declarations the cursor could not be put on, so nothing was asked.
  notQueried: number
  exact: number
  truthReferences: number
  found: number
  missing: number
  // Ours at a site the oracle resolves elsewhere.
  wrong: number
  // Ours at a site whose target nobody can know statically.
  unverified: number
  // Uses of identical copies in other flats, listed apart and not scored.
  elsewhere: number
  queryMs: number[]
  samples: string[]
}

// Ground truth is the oracle read backwards: the references of a declaration
// are all sites the compiler or the chain resolve to it. Each declaration is
// queried the way a user would, with the cursor on its name.
export function scoreReferences(
  workspace: FlatWorkspace,
  sites: OracleSite[],
): ReferenceScore {
  const siteByKey = new Map<string, OracleSite>()
  const truthByTarget = new Map<
    string,
    { target: TruthTarget; sites: Set<string> }
  >()
  for (const site of sites) {
    const key = siteKey(workspace, site.path, site.offset)
    siteByKey.set(key, site)
    if (site.truth.kind !== 'known') {
      continue
    }
    for (const target of site.truth.targets) {
      const targetKey = siteKey(workspace, target.path, target.start)
      const entry = truthByTarget.get(targetKey) ?? { target, sites: new Set() }
      entry.sites.add(key)
      truthByTarget.set(targetKey, entry)
    }
  }

  const score: ReferenceScore = {
    declarations: 0,
    notQueried: 0,
    exact: 0,
    truthReferences: 0,
    found: 0,
    missing: 0,
    wrong: 0,
    unverified: 0,
    elsewhere: 0,
    queryMs: [],
    samples: [],
  }
  for (const { target, sites: truth } of truthByTarget.values()) {
    const name = wordAt(workspace, [...truth][0], siteByKey)
    const started = performance.now()
    const ours = queryDeclaration(workspace, target, name)
    score.queryMs.push(performance.now() - started)
    if (ours === undefined) {
      score.notQueried++
      if (score.samples.length < 200) {
        score.samples.push(
          `not queried ${where(workspace, target.path, target.start)} (${name})`,
        )
      }
      continue
    }
    score.elsewhere += ours.elsewhere
    tally(score, workspace, target, truth, ours.sites, siteByKey)
  }
  return score
}

function tally(
  score: ReferenceScore,
  workspace: FlatWorkspace,
  target: TruthTarget,
  truth: Set<string>,
  ours: Set<string>,
  siteByKey: Map<string, OracleSite>,
) {
  let missing = 0
  let wrong = 0
  const details: string[] = []
  for (const key of truth) {
    const site = siteByKey.get(key)
    if (!ours.has(key) && site !== undefined) {
      missing++
      details.push(`  missing ${where(workspace, site.path, site.offset)}`)
    }
  }
  for (const key of ours) {
    const site = siteByKey.get(key)
    if (site === undefined || truth.has(key)) {
      continue
    }
    if (site.truth.kind === 'known' || site.truth.kind === 'outside') {
      wrong++
      details.push(`  wrong ${where(workspace, site.path, site.offset)}`)
    } else {
      score.unverified++
    }
  }
  score.declarations++
  score.truthReferences += truth.size
  score.found += truth.size - missing
  score.missing += missing
  score.wrong += wrong
  if (missing === 0 && wrong === 0) {
    score.exact++
  } else if (score.samples.length < 200) {
    score.samples.push(
      `declaration ${where(workspace, target.path, target.start)}`,
      ...details,
    )
  }
}

function queryDeclaration(
  workspace: FlatWorkspace,
  target: TruthTarget,
  name: string,
): { sites: Set<string>; elsewhere: number } | undefined {
  if (name === '') {
    return undefined
  }
  const text = workspace.text(target.path).slice(target.start, target.end)
  for (const relative of wordOccurrences(text, name)) {
    const result = findReferences(
      workspace,
      target.path,
      target.start + relative,
    )
    const declaration = result.targets[0]?.declaration.range
    if (
      result.targets.length !== 1 ||
      declaration === undefined ||
      declaration[0] < target.start - 1 ||
      declaration[0] >= target.end
    ) {
      continue
    }
    return {
      sites: new Set(
        result.references
          .filter((r) => !r.elsewhere)
          .map((r) => siteKey(workspace, r.path, r.offset)),
      ),
      elsewhere: result.references.filter((r) => r.elsewhere).length,
    }
  }
  return undefined
}

function wordAt(
  workspace: FlatWorkspace,
  key: string | undefined,
  siteByKey: Map<string, OracleSite>,
): string {
  const site = key ? siteByKey.get(key) : undefined
  if (site === undefined) {
    return ''
  }
  const text = workspace.text(site.path)
  let end = site.offset
  while (end < text.length && isWordCharacter(text[end])) {
    end++
  }
  return text.slice(site.offset, end)
}

function isWordCharacter(character: string | undefined): boolean {
  return (
    character !== undefined &&
    ((character >= 'a' && character <= 'z') ||
      (character >= 'A' && character <= 'Z') ||
      (character >= '0' && character <= '9') ||
      character === '_' ||
      character === '$')
  )
}

function where(workspace: FlatWorkspace, path: string, offset: number) {
  const text = workspace.text(path)
  const line = text.slice(0, offset).split('\n').length
  const start = text.lastIndexOf('\n', offset) + 1
  const end = text.indexOf('\n', offset)
  const content = text.slice(start, end === -1 ? undefined : end).trim()
  return `${path.split('/.flat/')[1] ?? path}:${line}: ${content.slice(0, 110)}`
}

// By exact file: identical copies can resolve differently across contracts.
function siteKey(_workspace: FlatWorkspace, path: string, offset: number) {
  return `${path}:${offset}`
}
