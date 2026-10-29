import type { ConfigReader, EntryParameters } from '@l2beat/discovery'
import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import { compareFiles } from '../../discovery/getCodePaths'
import { FlatWorkspace, projectEntries } from '../../xref/FlatWorkspace'
import type { FlatSourceClient } from '../diffovery/FlatSourceClient'
import { entrySourceLinks } from '../getCode'
import { reachableAddresses } from './router'

// The readonly server has no flats on disk, so it builds each project's
// workspace from explorer sources, the same text its code panel shows.
// Building one fetches every source in the project, so a few are kept.
export class RemoteWorkspaces {
  // Insertion order is recency order, so the first key is evicted first.
  private readonly workspaces = new Map<string, Promise<FlatWorkspace>>()

  constructor(
    private readonly configReader: ConfigReader,
    private readonly flatSourceClient: FlatSourceClient,
    private readonly capacity: number,
  ) {
    assert(capacity > 0, 'Capacity must be positive')
  }

  get(project: string): Promise<FlatWorkspace> {
    const cached = this.workspaces.get(project)
    const workspace = cached ?? this.load(project)
    this.workspaces.delete(project)
    this.workspaces.set(project, workspace)
    if (cached === undefined) {
      workspace.catch(() => {
        if (this.workspaces.get(project) === workspace) {
          this.workspaces.delete(project)
        }
      })
    }
    while (this.workspaces.size > this.capacity) {
      const oldest = this.workspaces.keys().next().value
      assert(oldest !== undefined, 'Map over capacity is not empty')
      this.workspaces.delete(oldest)
    }
    return workspace
  }

  private async load(project: string): Promise<FlatWorkspace> {
    const reachable = reachableAddresses(this.configReader, project)
    const addressOfPath = new Map<string, ChainSpecificAddress>()
    const entries = projectEntries(this.configReader, project, (_, entry) => {
      if (entry.type !== 'Contract' || !reachable.has(entry.address)) {
        return []
      }
      const paths = remoteSourcePaths(entry)
      for (const [path, address] of paths) {
        addressOfPath.set(path, address)
      }
      return [...paths.keys()]
    }).filter((e) => reachable.has(e.address))

    const addresses = [...new Set(addressOfPath.values())]
    const sources = await Promise.all(
      addresses.map((a) => this.flatSourceClient.getContractFlat(a)),
    )
    const texts = new Map(addresses.map((a, i) => [a, sources[i]?.flat]))

    return new FlatWorkspace(entries, (path) => {
      const address = addressOfPath.get(path)
      assert(address !== undefined, 'Path outside the workspace')
      const text = texts.get(address)
      assert(text !== undefined, 'Source not fetched')
      return text
    })
  }
}

// Named like the flats discovery writes, so ordering them with compareFiles,
// as navigation does, gives the order the code panel lists them in.
function remoteSourcePaths(
  entry: EntryParameters,
): Map<string, ChainSpecificAddress> {
  const links = entrySourceLinks(entry)
  const paths = new Map<string, ChainSpecificAddress>()
  for (const [i, link] of links.entries()) {
    const isProxy = links.length > 1 && i === 0
    const postfix = isProxy ? '.p' : links.length > 2 ? `.${i}` : ''
    paths.set(`/${entry.address}/${link.name}${postfix}.sol`, link.address)
  }
  const panelOrder = [...paths.keys()]
  const sorted = [...panelOrder].sort(compareFiles)
  assert(paths.size === links.length, 'Source paths collide')
  assert(
    sorted.every((path, i) => path === panelOrder[i]),
    'Source paths out of panel order',
  )
  return paths
}
