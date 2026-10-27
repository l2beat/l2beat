import type { ReceivedPermission } from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'

export interface PermissionHolder {
  address: ChainSpecificAddress
  name: string | undefined
  isEOA: boolean
  receivedPermissions?: ReceivedPermission[]
  // Set for multisigs.
  signers?: { threshold: number; members: ChainSpecificAddress[] }
  // What its $admin and owner fields point at.
  controllers: ChainSpecificAddress[]
}

export interface PermissionPath {
  permission: string
  role: string | undefined
  // Holder first, target last: the order a researcher reads control in.
  path: ChainSpecificAddress[]
  delaySeconds: number
  conditions: string[]
  descriptions: string[]
}

export function permissionPaths(
  holders: readonly PermissionHolder[],
  target: ChainSpecificAddress,
): PermissionPath[] {
  return indexPermissionPaths(holders).get(target) ?? []
}

// Every target's paths in one pass. One entry per distinct route: a holder
// granted several functions over the same route gets one path listing what
// each grants.
export function indexPermissionPaths(
  holders: readonly PermissionHolder[],
): Map<ChainSpecificAddress, PermissionPath[]> {
  const byRoute = new Map<string, PermissionPath>()
  for (const holder of holders) {
    for (const received of holder.receivedPermissions ?? []) {
      const path = toPath(holder.address, received, received.from)
      const key = [
        path.permission,
        path.role,
        path.delaySeconds,
        ...path.path,
        ...path.conditions,
      ].join(' ')
      const existing = byRoute.get(key)
      if (existing === undefined) {
        byRoute.set(key, path)
      } else {
        for (const description of path.descriptions) {
          if (!existing.descriptions.includes(description)) {
            existing.descriptions.push(description)
          }
        }
      }
    }
  }
  const byTarget = new Map<ChainSpecificAddress, PermissionPath[]>()
  for (const path of byRoute.values()) {
    const target = path.path[path.path.length - 1] as ChainSpecificAddress
    const paths = byTarget.get(target) ?? []
    paths.push(path)
    byTarget.set(target, paths)
  }
  for (const paths of byTarget.values()) {
    paths.sort(
      (a, b) =>
        a.permission.localeCompare(b.permission) ||
        a.delaySeconds - b.delaySeconds ||
        a.path.length - b.path.length,
    )
  }
  return byTarget
}

function toPath(
  holder: ChainSpecificAddress,
  received: ReceivedPermission,
  target: ChainSpecificAddress,
): PermissionPath {
  const via = received.via ?? []
  const conditions: string[] = []
  let delaySeconds = received.delay ?? 0
  for (const step of via) {
    delaySeconds += step.delay ?? 0
    if (step.condition !== undefined) conditions.push(step.condition)
  }
  if (received.condition !== undefined) conditions.push(received.condition)
  return {
    permission: received.permission,
    role: received.role,
    path: [holder, ...via.map((step) => step.address).reverse(), target],
    delaySeconds,
    conditions,
    descriptions:
      received.description === undefined ? [] : [received.description],
  }
}

const CONTROLLER_HOPS_MAX = 5

// Some projects model permissions on a governance contract rather than on
// each contract it controls. Then the answer for the contract is the answer
// for the nearest controller up its $admin and owner chain, with the chain
// appended to every path.
export function inheritedPaths(
  target: ChainSpecificAddress,
  byAddress: ReadonlyMap<ChainSpecificAddress, PermissionHolder>,
  pathsOf: (address: ChainSpecificAddress) => readonly PermissionPath[],
):
  | {
      controller: ChainSpecificAddress
      chain: ChainSpecificAddress[]
      paths: PermissionPath[]
    }
  | undefined {
  const chain = [target]
  for (let hop = 0; hop < CONTROLLER_HOPS_MAX; hop++) {
    const current = chain[0] as ChainSpecificAddress
    const next = byAddress
      .get(current)
      ?.controllers.find((controller) => !chain.includes(controller))
    if (next === undefined) {
      return undefined
    }
    chain.unshift(next)
    const paths = pathsOf(next)
    if (paths.length > 0) {
      const below = chain.slice(1)
      return {
        controller: next,
        chain,
        paths: paths.map((p) => ({ ...p, path: [...p.path, ...below] })),
      }
    }
  }
  return undefined
}

export interface ControlPaths {
  paths: PermissionPath[]
  // Set when nothing is modelled on the target itself.
  inherited:
    | { controller: ChainSpecificAddress; chain: ChainSpecificAddress[] }
    | undefined
}

// What a researcher means by "who controls this".
export function controlPaths(
  target: ChainSpecificAddress,
  byAddress: ReadonlyMap<ChainSpecificAddress, PermissionHolder>,
  index: ReadonlyMap<ChainSpecificAddress, readonly PermissionPath[]>,
): ControlPaths {
  const direct = index.get(target) ?? []
  if (direct.length > 0) {
    return { paths: [...direct], inherited: undefined }
  }
  const inherited = inheritedPaths(target, byAddress, (a) => index.get(a) ?? [])
  if (inherited === undefined) {
    return { paths: [], inherited: undefined }
  }
  return {
    paths: inherited.paths,
    inherited: { controller: inherited.controller, chain: inherited.chain },
  }
}

const SIGNER_DEPTH_MAX = 3

// Who stands behind a holder: a multisig's threshold and members, and theirs
// in turn, with EOAs counted rather than listed.
export function signerTree(
  holder: ChainSpecificAddress,
  byAddress: ReadonlyMap<ChainSpecificAddress, PermissionHolder>,
): string[] {
  const lines: string[] = []
  const seen = new Set<ChainSpecificAddress>()
  const stack: { address: ChainSpecificAddress; depth: number }[] = [
    { address: holder, depth: 0 },
  ]
  for (let item = stack.pop(); item !== undefined; item = stack.pop()) {
    const entry = byAddress.get(item.address)
    if (entry === undefined || seen.has(item.address)) {
      continue
    }
    seen.add(item.address)
    const indent = '  '.repeat(item.depth)
    const name = entry.name ?? item.address
    if (entry.signers === undefined) {
      lines.push(`${indent}${name}${entry.isEOA ? ', EOA' : ''}`)
      continue
    }
    const { threshold, members } = entry.signers
    const eoas = members.filter((m) => byAddress.get(m)?.isEOA !== false)
    const contracts = members.filter((m) => byAddress.get(m)?.isEOA === false)
    const eoaNote = eoas.length > 0 ? `, ${eoas.length} EOAs` : ''
    lines.push(`${indent}${name}: ${threshold} of ${members.length}${eoaNote}`)
    if (item.depth + 1 < SIGNER_DEPTH_MAX) {
      for (const member of contracts.reverse()) {
        stack.push({ address: member, depth: item.depth + 1 })
      }
    }
  }
  return lines
}

export function formatDelay(seconds: number): string {
  if (seconds === 0) {
    return 'no delay'
  }
  const days = seconds / 86_400
  if (days >= 1) {
    return `${Number(days.toFixed(1))}d`
  }
  const hours = seconds / 3_600
  if (hours >= 1) {
    return `${Number(hours.toFixed(1))}h`
  }
  return `${seconds}s`
}
