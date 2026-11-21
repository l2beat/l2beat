import { assert, type json } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { WatchContext, WatchTemplate } from '../WatchTemplate'
import { sortDeep } from '../watchedValue'
import { fetchGithubTree, type GithubTree } from './github'
import {
  type Known,
  loadKnownJson,
  loadKnownTarball,
} from './ossificationDataset'

const Params = v.strictObject({
  // knownUrl once the dataset publishes known.json, tarballUrl until then.
  dataset: v.union([
    v.strictObject({ knownUrl: v.string() }),
    v.strictObject({ tarballUrl: v.string() }),
  ]),
  defiHackLabs: v.strictObject({
    repository: v.string(),
    branch: v.string(),
    pathPrefix: v.string(),
    // YYYY-MM, compared as a string with the PoC's month directory.
    sinceMonth: v.string().check(isMonth, 'Expected YYYY-MM'),
  }),
})
type Params = v.infer<typeof Params>

type Lead =
  | { status: 'handled'; title: string; url: string }
  | { status: 'open'; pending: true; title: string; url: string }

// DeFiHackLabs PoCs against the ossification dataset. A lead is handled when
// its key appears anywhere in the dataset; an open one is pending, so the
// reminder lists it until the dataset records it. `incidents` and `recorded`
// make every dataset addition, from any source, reach diffHistory.
export const ossificationLeads: WatchTemplate<typeof Params> = {
  name: 'ossificationLeads',
  params: Params,
  async fetch(params, context) {
    const known = await loadKnown(params.dataset, context)
    const { repository, branch } = params.defiHackLabs
    const tree = await fetchGithubTree(context, repository, branch)
    const recorded = new Set(known.recorded)
    const leads: Record<string, Lead> = {}
    for (const path of findPocPaths(tree, params.defiHackLabs)) {
      const key = `dfhl:${path}`
      leads[key] = toLead(path, recorded.has(key), repository, branch)
    }
    return sortDeep({
      incidents: known.incidents,
      leads,
      recorded: Object.fromEntries(known.recorded.map((key) => [key, true])),
    } as json)
  },
}

async function loadKnown(
  dataset: Params['dataset'],
  context: WatchContext,
): Promise<Known> {
  if ('knownUrl' in dataset) {
    return await loadKnownJson(context, dataset.knownUrl)
  }
  return await loadKnownTarball(context, dataset.tarballUrl)
}

// Only PoC files directly in a month directory: deeper files are a PoC's
// helper interfaces and libraries.
function findPocPaths(
  tree: GithubTree,
  defiHackLabs: Params['defiHackLabs'],
): string[] {
  const paths: string[] = []
  for (const entry of tree.tree) {
    if (entry.type !== 'blob' || !entry.path.endsWith('.sol')) {
      continue
    }
    if (!entry.path.startsWith(defiHackLabs.pathPrefix)) {
      continue
    }
    const segments = entry.path.slice(defiHackLabs.pathPrefix.length).split('/')
    const month = segments[0]
    if (segments.length !== 2 || month === undefined) {
      continue
    }
    if (!isMonth(month)) {
      throw new Error('Unexpected PoC directory', { cause: { month } })
    }
    if (month >= defiHackLabs.sinceMonth) {
      paths.push(entry.path)
    }
  }
  return paths
}

function toLead(
  path: string,
  handled: boolean,
  repository: string,
  branch: string,
): Lead {
  const file = path.slice(path.lastIndexOf('/') + 1)
  assert(file.endsWith('.sol'))
  const title = file.endsWith('_exp.sol')
    ? file.slice(0, -'_exp.sol'.length)
    : file.slice(0, -'.sol'.length)
  // Branch-pinned, for a human to click; the dataset pins the commit itself.
  const url = `https://github.com/${repository}/blob/${branch}/${path}`
  return handled
    ? { status: 'handled', title, url }
    : { status: 'open', pending: true, title, url }
}

function isMonth(value: string): boolean {
  const [year, month, ...rest] = value.split('-')
  return (
    rest.length === 0 &&
    year?.length === 4 &&
    month?.length === 2 &&
    isDigits(year) &&
    isDigits(month)
  )
}

function isDigits(value: string): boolean {
  for (const char of value) {
    if (char < '0' || char > '9') {
      return false
    }
  }
  return true
}
