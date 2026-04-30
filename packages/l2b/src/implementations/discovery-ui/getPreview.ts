import type { ProjectContract, ProjectPermissions } from '@l2beat/config'
import { ProjectDiscovery } from '@l2beat/config/build/discovery/ProjectDiscovery'
import type { ConfigReader, DiscoveryOutput, ReceivedPermission } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import { getCodePaths } from './getCode'
import { getAllProjectDiscoveries } from './getDiscoveries'
import { type ContractsMeta, getMeta } from './getMeta'
import type {
  AddressFieldValue,
  ApiPreviewCounterpartyRiskScenario,
  ApiPreviewContract,
  ApiPreviewExpandedPermissionChain,
  ApiPreviewMissingSource,
  ApiPreviewPermissionPath,
  ApiPreviewPermissions,
  ApiPreviewResponse,
  ApiPreviewSourceCoverage,
} from './types'

const TARGET_TOKEN_ADDRESSES = new Set([
  'eth:0xa1290d69c65a6fe4df752f95823fae25cb99e5a7',
  'eth:0x85d456b2dff1fd8245387c0bfb64dfb700e98ef3',
  'unichain:0xc3eacf0612346366db554c991d7858716db09f58',
])
const SYSTEM_KEYWORDS = [
  { system: 'LayerZero', key: 'layerzero' },
  { system: 'EigenLayer', key: 'eigen' },
  { system: 'Lido', key: 'lido' },
  { system: 'Stader', key: 'stader' },
  { system: 'Kelp', key: 'kelp' },
]

export function getPreview(
  configReader: ConfigReader,
  projectId: string,
): ApiPreviewResponse {
  const discoveries = getAllProjectDiscoveries(configReader, projectId)

  const permissionsPerChain: {
    chain: string
    permissions: ProjectPermissions
  }[] = []
  const contractsPerChain: {
    chain: string
    contracts: ProjectContract[]
  }[] = []

  const meta = getMeta(discoveries)
  const processor = new ProjectDiscovery(projectId)
  const wholePermissions = processor.getDiscoveredPermissions()
  const wholeContracts = processor.getDiscoveredContracts()
  for (const [chain, permissions] of Object.entries(wholePermissions)) {
    permissionsPerChain.push({ chain, permissions })
  }
  for (const [chain, contracts] of Object.entries(wholeContracts)) {
    contractsPerChain.push({ chain, contracts })
  }

  const sourceCoverage = getSourceCoverage(configReader, projectId, discoveries)
  const sourceByAddress = getSourceByAddress(configReader, projectId, discoveries)
  const expandedPermissionChains = getExpandedPermissionChains(
    discoveries,
    meta,
    sourceByAddress,
  )
  const counterpartyRiskScenarios = getCounterpartyRiskScenarios(
    expandedPermissionChains,
  )

  return {
    permissionsPerChain: getPermissionsPreview(permissionsPerChain, meta),
    contractsPerChain: getContractsPreview(contractsPerChain, meta),
    permissionPathsPerChain: getPermissionPathsPreview(discoveries, meta),
    sourceCoverage,
    expandedPermissionChains,
    counterpartyRiskScenarios,
  }
}

function getPermissionsPreview(
  permissionsPerChain: {
    chain: string
    permissions: ProjectPermissions
  }[],
  meta: ContractsMeta,
): { chain: string; permissions: ApiPreviewPermissions }[] {
  return permissionsPerChain.map(({ chain, permissions }) => ({
    chain,
    permissions: {
      roles: (permissions.roles ?? []).map((p) => ({
        addresses: p.accounts.map((a) => toAddressFieldValue(a.address, meta)),
        name: p.name,
        description: p.description,
        multisigParticipants: p.participants?.map((x) =>
          toAddressFieldValue(x.address, meta),
        ),
      })),
      actors: (permissions.actors ?? []).map((p) => ({
        addresses: p.accounts.map((a) => toAddressFieldValue(a.address, meta)),
        name: p.name,
        description: p.description,
        multisigParticipants: p.participants?.map((x) =>
          toAddressFieldValue(x.address, meta),
        ),
      })),
    },
  }))
}

function getContractsPreview(
  contractsPerChain: { chain: string; contracts: ProjectContract[] }[],
  meta: ContractsMeta,
): { chain: string; contracts: ApiPreviewContract[] }[] {
  return contractsPerChain.map(({ chain, contracts }) => ({
    chain,
    contracts: contracts.map((c) => {
      return {
        addresses: [toAddressFieldValue(c.address, meta)],
        name: c.name,
        description: c.description ?? '',
        upgradableBy: c.upgradableBy,
      }
    }),
  }))
}

function getPermissionPathsPreview(
  discoveries: DiscoveryOutput[],
  meta: ContractsMeta,
): { chain: string; paths: ApiPreviewPermissionPath[] }[] {
  const perChain = new Map<string, ApiPreviewPermissionPath[]>()
  const seen = new Set<string>()

  for (const discovery of discoveries) {
    for (const entry of discovery.entries) {
      if (isTargetToken(entry.address)) {
        const owner = getAddressField(entry.values, 'owner')
        if (owner) {
          const chain = ChainSpecificAddress.longChain(entry.address)
          const chainPaths = perChain.get(chain) ?? []
          const syntheticKey = `synthetic-owner::${owner}::${entry.address}`
          if (!seen.has(syntheticKey)) {
            const actor = toAddressFieldValue(owner, meta)
            const target = toAddressFieldValue(entry.address, meta)
            const exists = chainPaths.some(
              (path) =>
                path.permission === 'interact' &&
                path.actor.address === actor.address &&
                path.target.address === target.address &&
                path.via.length === 0,
            )
            if (!exists) {
              seen.add(syntheticKey)
              chainPaths.push({
                actor,
                permission: 'interact',
                target,
                via: [],
                description:
                  'owner can configure token/OFT parameters and message-path settings.',
              })
              perChain.set(chain, chainPaths)
            }
          }
        }
      }

      const permissions = [
        ...(entry.receivedPermissions ?? []),
        ...(entry.directlyReceivedPermissions ?? []),
      ]

      for (const permission of permissions) {
        if (!isTargetToken(permission.from)) {
          continue
        }
        const chain = ChainSpecificAddress.longChain(permission.from)
        const chainPaths = perChain.get(chain) ?? []
        const key = permissionDedupKey(entry.address, permission)
        if (seen.has(key)) {
          continue
        }
        seen.add(key)

        chainPaths.push({
          actor: toAddressFieldValue(entry.address, meta),
          permission: permission.permission,
          target: toAddressFieldValue(permission.from, meta),
          via: (permission.via ?? []).map((v) => ({
            address: toAddressFieldValue(v.address, meta),
            delay: v.delay,
            condition: v.condition,
          })),
          description: permission.description,
        })
        perChain.set(chain, chainPaths)
      }
    }
  }

  return [...perChain.entries()]
    .map(([chain, paths]) => ({ chain, paths: deduplicatePermissionPaths(paths) }))
    .sort((a, b) => a.chain.localeCompare(b.chain))
}

function deduplicatePermissionPaths(
  paths: ApiPreviewPermissionPath[],
): ApiPreviewPermissionPath[] {
  const deduped = new Map<string, ApiPreviewPermissionPath>()
  for (const path of paths) {
    const viaKey = path.via
      .map(
        (step) =>
          `${step.address.address}|${step.delay ?? ''}|${step.condition ?? ''}`,
      )
      .join('->')
    const key = `${path.permission}|${path.actor.address}|${path.target.address}|${viaKey}`
    const current = deduped.get(key)
    if (!current || (!current.description && path.description)) {
      deduped.set(key, path)
    }
  }
  return [...deduped.values()]
}

function getSourceCoverage(
  configReader: ConfigReader,
  projectId: string,
  discoveries: DiscoveryOutput[],
): ApiPreviewSourceCoverage {
  const missing: ApiPreviewMissingSource[] = []
  const checked = new Set<string>()

  for (const discovery of discoveries) {
    for (const entry of discovery.entries) {
      if (entry.type !== 'Contract') continue
      if (checked.has(entry.address)) continue
      checked.add(entry.address)

      const codePaths = getCodePathsSafe(configReader, projectId, entry.address)
      const expectedPaths = codePaths.map((x) => x.path)
      if (expectedPaths.length === 0 || expectedPaths.some((path) => !existsSync(path))) {
        missing.push({
          chain: ChainSpecificAddress.longChain(entry.address),
          address: entry.address,
          name: entry.name ?? entry.address,
          expectedPaths,
        })
      }
    }
  }

  return {
    strictMode: true,
    complete: missing.length === 0,
    missing,
  }
}

function getExpandedPermissionChains(
  discoveries: DiscoveryOutput[],
  meta: ContractsMeta,
  sourceByAddress: Map<string, string>,
): ApiPreviewExpandedPermissionChain[] {
  const edges = discoveries.flatMap((discovery) =>
    discovery.entries.flatMap((entry) =>
      [...(entry.receivedPermissions ?? []), ...(entry.directlyReceivedPermissions ?? [])].map(
        (permission) => ({
          actor: entry.address,
          target: permission.from,
          permission,
        }),
      ),
    ),
  )

  const byTarget = new Map<string, typeof edges>()
  for (const edge of edges) {
    const target = edge.target.toLowerCase()
    const current = byTarget.get(target) ?? []
    current.push(edge)
    byTarget.set(target, current)
  }

  const chains: ApiPreviewExpandedPermissionChain[] = []
  const seen = new Set<string>()
  let frontier = [...getInfluenceSeeds(discoveries)]

  for (let depth = 1; depth <= 5 && frontier.length > 0; depth++) {
    const nextFrontier = new Set<string>()

    for (const target of frontier) {
      const outgoing = byTarget.get(target.toLowerCase()) ?? []
      for (const edge of outgoing) {
        const key = permissionDedupKey(edge.actor, edge.permission)
        if (seen.has(key)) continue
        seen.add(key)

        const systems = detectSystems([
          toAddressFieldValue(edge.actor, meta).name,
          toAddressFieldValue(edge.target, meta).name,
          edge.permission.description,
          ...((edge.permission.via ?? []).map((v) => toAddressFieldValue(v.address, meta).name) ??
            []),
        ])

        const capabilities = inferCapabilities(
          edge.permission.permission,
          edge.actor,
          edge.permission.via?.map((v) => v.address) ?? [],
          sourceByAddress,
        )

        chains.push({
          chain: ChainSpecificAddress.longChain(edge.target),
          permission: edge.permission.permission,
          actor: toAddressFieldValue(edge.actor, meta),
          target: toAddressFieldValue(edge.target, meta),
          via: (edge.permission.via ?? []).map((v) => ({
            address: toAddressFieldValue(v.address, meta),
            delay: v.delay,
            condition: v.condition,
          })),
          depth,
          description: edge.permission.description,
          capabilities,
          systems,
        })

        nextFrontier.add(edge.actor.toLowerCase())
      }
    }

    frontier = [...nextFrontier]
  }

  return chains
}

function getInfluenceSeeds(discoveries: DiscoveryOutput[]): Set<string> {
  const entries = discoveries.flatMap((d) => d.entries)
  const byAddress = new Map(entries.map((e) => [e.address.toLowerCase(), e]))

  const seeds = new Set<string>([...TARGET_TOKEN_ADDRESSES])
  const queue: Array<{ address: string; depth: number }> = [...TARGET_TOKEN_ADDRESSES].map(
    (address) => ({ address, depth: 0 }),
  )
  const visited = new Set<string>()
  const maxDepth = 2

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) break
    const key = current.address.toLowerCase()
    if (visited.has(key)) continue
    visited.add(key)

    const entry = byAddress.get(key)
    if (!entry) continue
    const refs = extractAddresses(entry.values)
    for (const ref of refs) {
      const refKey = ref.toLowerCase()
      if (!seeds.has(refKey)) {
        seeds.add(refKey)
      }
      if (current.depth < maxDepth) {
        queue.push({ address: refKey, depth: current.depth + 1 })
      }
    }
  }

  return seeds
}

function extractAddresses(value: unknown): ChainSpecificAddress[] {
  if (value === null || value === undefined) {
    return []
  }
  if (typeof value === 'string') {
    return isChainAddress(value) ? [value as ChainSpecificAddress] : []
  }
  if (Array.isArray(value)) {
    return value.flatMap((v) => extractAddresses(v))
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap((v) =>
      extractAddresses(v),
    )
  }
  return []
}

function isChainAddress(value: string): boolean {
  return /^[a-z0-9-]+:0x[a-fA-F0-9]{40}$/.test(value)
}

function inferCapabilities(
  permissionType: string,
  actor: ChainSpecificAddress,
  via: ChainSpecificAddress[],
  sourceByAddress: Map<string, string>,
): string[] {
  if (permissionType === 'upgrade') {
    return ['can upgrade implementation code']
  }

  const addresses = [actor, ...via]
  const source = addresses
    .map((address) => sourceByAddress.get(address.toLowerCase()) ?? '')
    .join('\n')
    .toLowerCase()

  const caps: string[] = []
  if (permissionType === 'interact') {
    if (/\bset(config|peer|default|receive|send|library|dvn|executor)\b/.test(source)) {
      caps.push('can change bridge/configuration parameters')
    }
    if (/\bpause|unpause\b/.test(source)) {
      caps.push('can pause/unpause critical flows')
    }
    if (/\bmint|burn\b/.test(source)) {
      caps.push('can influence mint/burn pathways')
    }
    if (/\bfee|receiver|treasury|reward\b/.test(source)) {
      caps.push('can modify fee/reward routing')
    }
    if (/\bowner|admin|role\b/.test(source)) {
      caps.push('can alter role/owner controlled behavior')
    }
  } else if (permissionType === 'act') {
    caps.push('can execute privileged admin actions')
  }

  return caps.length > 0 ? [...new Set(caps)] : ['capability requires manual source inspection']
}

function detectSystems(names: (string | undefined)[]): string[] {
  const found = new Set<string>()
  for (const name of names) {
    const lower = (name ?? '').toLowerCase()
    for (const item of SYSTEM_KEYWORDS) {
      if (lower.includes(item.key)) {
        found.add(item.system)
      }
    }
  }
  return [...found]
}

function getCounterpartyRiskScenarios(
  chains: ApiPreviewExpandedPermissionChain[],
): ApiPreviewCounterpartyRiskScenario[] {
  const grouped = new Map<string, ApiPreviewExpandedPermissionChain[]>()

  for (const chain of chains) {
    const systems = chain.systems.length > 0 ? chain.systems : ['Unclassified']
    for (const system of systems) {
      const current = grouped.get(system) ?? []
      current.push(chain)
      grouped.set(system, current)
    }
  }

  const scenarios: ApiPreviewCounterpartyRiskScenario[] = []
  for (const [system, items] of grouped.entries()) {
    const impacts = new Set<string>()
    const refs = new Set<string>()
    for (const item of items) {
      refs.add(`${item.actor.name ?? item.actor.address} -> ${item.target.name ?? item.target.address}`)
      for (const cap of item.capabilities) {
        if (cap.includes('upgrade')) impacts.add('code integrity risk')
        if (cap.includes('bridge/configuration')) impacts.add('bridge authenticity/liveness risk')
        if (cap.includes('pause')) impacts.add('operational liveness risk')
        if (cap.includes('fee/reward')) impacts.add('value accrual routing risk')
        if (cap.includes('mint/burn')) impacts.add('token supply/control risk')
      }
    }

    scenarios.push({
      system,
      title: `${system} control surface can affect rsETH trust assumptions`,
      impact: [...impacts].join('; ') || 'governance/admin counterparty risk',
      chainRefs: [...refs].slice(0, 10),
    })
  }

  return scenarios.sort((a, b) => a.system.localeCompare(b.system))
}

function getSourceByAddress(
  configReader: ConfigReader,
  projectId: string,
  discoveries: DiscoveryOutput[],
): Map<string, string> {
  const byAddress = new Map<string, string>()
  const checked = new Set<string>()
  for (const discovery of discoveries) {
    for (const entry of discovery.entries) {
      if (entry.type !== 'Contract') continue
      const key = entry.address.toLowerCase()
      if (checked.has(key)) continue
      checked.add(key)
      const codePaths = getCodePathsSafe(configReader, projectId, entry.address)
      const source = codePaths
        .filter((path) => existsSync(path.path))
        .map((path) => readFileSync(path.path, 'utf8'))
        .join('\n')
      byAddress.set(key, source)
    }
  }
  return byAddress
}

function getCodePathsSafe(
  configReader: ConfigReader,
  projectId: string,
  address: ChainSpecificAddress,
) {
  try {
    return getCodePaths(configReader, projectId, address).codePaths
  } catch {
    return []
  }
}

function permissionDedupKey(target: ChainSpecificAddress, p: ReceivedPermission) {
  const via = (p.via ?? [])
    .map((v) => `${v.address}:${v.delay ?? ''}:${v.condition ?? ''}`)
    .join('|')

  return [target, p.from, p.permission, p.role ?? '', p.description ?? '', via].join('::')
}

function isTargetToken(address: ChainSpecificAddress): boolean {
  return TARGET_TOKEN_ADDRESSES.has(address.toLowerCase())
}

function getAddressField(
  values: Record<string, unknown> | undefined,
  key: string,
): ChainSpecificAddress | undefined {
  if (!values) return undefined
  const value = values[key]
  if (typeof value === 'string' && isChainAddress(value)) {
    return value as ChainSpecificAddress
  }
  return undefined
}

function toAddressFieldValue(
  address: ChainSpecificAddress,
  meta: ContractsMeta,
): AddressFieldValue {
  const metadata = meta[address]
  return {
    type: 'address',
    name: metadata?.name,
    address,
    addressType: metadata?.type ?? 'Unknown',
  }
}
