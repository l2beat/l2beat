import {
  type ConfigReader,
  type ContractValue,
  type DiscoveryOutput,
  type EntryParameters,
  get$Implementations,
} from '@l2beat/discovery'
import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import { resolve, sep } from 'path'
import { getEntryCodePaths } from '../discovery/getCodePaths'
import { getProjectDiscoveries } from '../discovery/getProjectDiscoveries'
import { SourceIndex } from './SourceIndex'

export interface FlatEntry {
  address: ChainSpecificAddress
  name: string
  type: 'Contract' | 'EOA'
  values: Record<string, ContractValue | undefined>
  abi: string[]
  // Implementations first: calls land there, the proxy only answers the rest.
  sourcePaths: string[]
}

export class FlatWorkspace {
  private readonly byAddress = new Map<ChainSpecificAddress, FlatEntry>()
  private readonly byPath = new Map<string, FlatEntry>()
  private readonly sources = new Map<string, SourceIndex>()
  private readonly texts = new Map<string, string>()
  private readonly contentIds = new Map<string, number>()
  private readonly contentIdsByText = new Map<string, number>()
  readonly sourcePaths: string[]

  constructor(
    readonly entries: FlatEntry[],
    private readonly readFile: (path: string) => string,
  ) {
    for (const entry of entries) {
      assert(!this.byAddress.has(entry.address), 'Duplicate entry address')
      this.byAddress.set(entry.address, entry)
      for (const path of entry.sourcePaths) {
        this.byPath.set(resolve(path), entry)
      }
    }
    this.sourcePaths = [...new Set(entries.flatMap((e) => e.sourcePaths))]
  }

  static fromProject(
    configReader: ConfigReader,
    project: string,
  ): FlatWorkspace {
    const entries: FlatEntry[] = []
    const seen = new Set<ChainSpecificAddress>()
    for (const discovery of getProjectDiscoveries(configReader, project)) {
      for (const entry of discovery.entries) {
        if (entry.type === 'Reference' || seen.has(entry.address)) {
          continue
        }
        seen.add(entry.address)
        const values = entry.values ?? {}
        const abiAddresses = [entry.address, ...get$Implementations(values)]
        const paths = readSourcePaths(configReader, discovery, entry)
        entries.push({
          address: entry.address,
          name: entry.name ?? entry.address,
          type: entry.type,
          values,
          abi: abiAddresses.flatMap((a) => discovery.abis[a] ?? []),
          sourcePaths: orderImplementationsFirst(paths),
        })
      }
    }
    return new FlatWorkspace(entries, (path) => readFileSync(path, 'utf-8'))
  }

  entryAt(address: ChainSpecificAddress): FlatEntry | undefined {
    return this.byAddress.get(address)
  }

  entryOfPath(path: string): FlatEntry | undefined {
    return this.byPath.get(resolve(path))
  }

  source(path: string): SourceIndex {
    let index = this.sources.get(path)
    if (index === undefined) {
      index = new SourceIndex(path, this.text(path))
      this.sources.set(path, index)
    }
    return index
  }

  text(path: string): string {
    let text = this.texts.get(path)
    if (text === undefined) {
      text = this.readFile(path)
      this.texts.set(path, text)
    }
    return text
  }

  contentId(path: string): number {
    let id = this.contentIds.get(path)
    if (id === undefined) {
      const text = this.text(path)
      id = this.contentIdsByText.get(text) ?? this.contentIdsByText.size
      this.contentIdsByText.set(text, id)
      this.contentIds.set(path, id)
    }
    return id
  }
}

export interface FlatLocation {
  projectsDirectory: string
  project: string
}

// The path alone names the project, whatever directory the caller runs in.
export function locateFlat(path: string): FlatLocation | undefined {
  const segments = resolve(path).split(sep)
  const flatIndex = segments.lastIndexOf('.flat')
  const project = segments[flatIndex - 1]
  if (flatIndex < 2 || project === undefined) {
    return undefined
  }
  return {
    projectsDirectory: segments.slice(0, flatIndex - 1).join(sep),
    project,
  }
}

export function isProxySource(path: string): boolean {
  return path.endsWith('.p.sol')
}

// Flats are untracked and fetched separately, so some entries may lack them.
function readSourcePaths(
  configReader: ConfigReader,
  discovery: DiscoveryOutput,
  entry: EntryParameters,
): string[] {
  try {
    return getEntryCodePaths(configReader, discovery, entry)
      .map((p) => p.path)
      .filter(existsSync)
  } catch (error) {
    if (isMissingFileError(error)) {
      return []
    }
    throw error
  }
}

function isMissingFileError(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT'
}

function orderImplementationsFirst(paths: string[]): string[] {
  return [
    ...paths.filter((path) => !isProxySource(path)),
    ...paths.filter(isProxySource),
  ]
}
