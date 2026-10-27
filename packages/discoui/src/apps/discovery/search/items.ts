import type {
  ApiAddressEntry,
  ApiCodeSearchResponse,
  ApiProjectChain,
  ApiProjectContract,
  ApiProjectEntry,
} from '../../../api/types'
import { toShortenedAddress } from '../../../utils/toShortenedAddress'
import { toSearchTerms } from './rank'
import type { SearchScope } from './scopes'

export type SearchCommand =
  | { type: 'openPanel'; panel: string }
  | { type: 'loadLayout'; index: number }
  | { type: 'addPanel' }
  | { type: 'closePanel' }
  | { type: 'toggleFullScreen' }
  | { type: 'discover' }
  | { type: 'goToProjects' }

interface ItemBase {
  key: string
  title: string
  detail: string
  trailing: string
}

export type SearchItem =
  | (ItemBase & { kind: 'contract'; address: string; isEoa: boolean })
  | (ItemBase & { kind: 'field'; address: string; fieldName: string })
  | (ItemBase & { kind: 'project'; project: string })
  | (ItemBase & { kind: 'command'; command: SearchCommand; shortcut: string })
  | (ItemBase & {
      kind: 'code'
      address: string
      sourceIndex: number
      offset: number
      length: number
    })
  | (ItemBase & { kind: 'scope'; scope: SearchScope })

export interface Searchable {
  item: SearchItem
  terms: string[]
}

export function buildContractSearchables(
  chains: ApiProjectChain[],
): Searchable[] {
  const result: Searchable[] = []
  for (const entry of uniqueEntries(chains)) {
    const contract = 'fields' in entry ? entry : undefined
    const isEoa = contract === undefined
    const bareAddress = entry.address.slice(entry.address.indexOf(':') + 1)
    result.push({
      item: {
        kind: 'contract',
        key: `contract:${entry.address}`,
        title: entry.name ?? toShortenedAddress(entry.address),
        detail: isEoa ? describeEoa(entry) : describeContract(contract),
        trailing: toShortenedAddress(entry.address),
        address: entry.address,
        isEoa,
      },
      terms: toSearchTerms([
        entry.name,
        bareAddress,
        entry.address,
        contract?.template?.id,
        contract?.proxyType,
        ...Object.values(contract?.implementationNames ?? {}),
        ...entry.roles,
        entry.description,
      ]),
    })
  }
  return result
}

export function buildFieldSearchables(chains: ApiProjectChain[]): Searchable[] {
  const result: Searchable[] = []
  for (const entry of uniqueEntries(chains)) {
    if (!('fields' in entry)) continue
    const contractTitle = entry.name ?? toShortenedAddress(entry.address)
    for (const field of entry.fields) {
      result.push({
        item: {
          kind: 'field',
          key: `field:${entry.address}:${field.name}`,
          title: field.name,
          detail: contractTitle,
          trailing: toShortenedAddress(entry.address),
          address: entry.address,
          fieldName: field.name,
        },
        terms: toSearchTerms([field.name, entry.name]),
      })
    }
  }
  return result
}

export function buildProjectSearchables(
  projects: ApiProjectEntry[],
  options: { matchContractNames: boolean },
): Searchable[] {
  return projects.map((project) => ({
    item: {
      kind: 'project',
      key: `project:${project.name}`,
      title: project.name,
      detail: '',
      trailing: '',
      project: project.name,
    },
    terms: toSearchTerms([
      project.name,
      ...project.addresses,
      ...(options.matchContractNames ? project.contractNames : []),
    ]),
  }))
}

export interface CommandDefinition {
  command: SearchCommand
  title: string
  shortcut: string
}

export function buildCommandSearchables(
  commands: CommandDefinition[],
): Searchable[] {
  return commands.map(({ command, title, shortcut }) => ({
    item: {
      kind: 'command',
      key: `command:${title}`,
      title,
      detail: '',
      trailing: '',
      command,
      shortcut,
    },
    terms: toSearchTerms([title]),
  }))
}

export function buildCodeItems(
  response: ApiCodeSearchResponse,
  needleLength: number,
): { key: string; label: string; items: SearchItem[] }[] {
  return response.matches.map((match) => ({
    key: match.address,
    label: `${match.name ?? 'EOA'} · ${toShortenedAddress(match.address)}`,
    items: match.codeLocation.map((location, i) => ({
      kind: 'code',
      key: `code:${match.address}:${i}`,
      title: location.line.trim(),
      detail: location.fileName,
      trailing: '',
      address: match.address,
      sourceIndex: location.index,
      offset: location.offset,
      length: needleLength,
    })),
  }))
}

function uniqueEntries(
  chains: ApiProjectChain[],
): (ApiProjectContract | ApiAddressEntry)[] {
  const seen = new Set<string>()
  const result: (ApiProjectContract | ApiAddressEntry)[] = []
  for (const chain of chains) {
    const entries = [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
      ...chain.eoas,
    ]
    for (const entry of entries) {
      if (seen.has(entry.address)) continue
      seen.add(entry.address)
      result.push(entry)
    }
  }
  return result
}

function describeContract(contract: ApiProjectContract): string {
  return contract.template?.id ?? contract.proxyType ?? ''
}

function describeEoa(entry: ApiAddressEntry): string {
  if (entry.roles.length === 0) return 'EOA'
  return `EOA · ${entry.roles.join(', ')}`
}
