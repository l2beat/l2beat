import {
  attachPermissions,
  type ConfigReader,
  getReachableEntries,
  type ReceivedPermission,
} from '@l2beat/discovery'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import type { PermissionHolder } from './permissionPaths'

const ZERO = EthereumAddress.ZERO

const PROJECT_CHARACTERS =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'

export const projectSchema = z
  .string()
  .check(
    (v) => v.length > 0 && [...v].every((c) => PROJECT_CHARACTERS.includes(c)),
    'Project must be alphanumeric',
  )

export interface ProjectEntry extends PermissionHolder {
  template: string | undefined
  category: string | undefined
  values: Record<string, unknown>
  // Permissions granted to this entry itself, before the model passes them
  // on to whoever controls it.
  directPermissions: ReceivedPermission[]
}

// The entries the graph draws: the project and the shared modules it
// references, reachable from the project, like getProject. Anything else the
// agent named would point at nothing on screen.
export function readProjectEntries(
  configReader: ConfigReader,
  project: string,
): ProjectEntry[] {
  const discoveries = configReader.readDiscoveryWithReferences(project)
  attachPermissions(discoveries)
  const all = discoveries
    .flatMap((d) => d.entries)
    .filter((e) => e.type !== 'Reference')
  const entrypoints = (discoveries[0]?.entries ?? []).map((e) => e.address)
  const reachable = new Set(
    getReachableEntries(all, entrypoints).map((e) => e.address),
  )
  const byAddress = new Map<ChainSpecificAddress, ProjectEntry>()
  for (const entry of all) {
    // The graph leaves out the zero address, like getProject.
    const isZero = ChainSpecificAddress.address(entry.address) === ZERO
    if (
      isZero ||
      !reachable.has(entry.address) ||
      byAddress.has(entry.address)
    ) {
      continue
    }
    byAddress.set(entry.address, {
      address: entry.address,
      name: entry.name,
      isEOA: entry.type === 'EOA',
      template: entry.template,
      category: entry.category?.name,
      values: entry.values ?? {},
      receivedPermissions: entry.receivedPermissions,
      directPermissions: entry.directlyReceivedPermissions ?? [],
      signers: readSigners(entry.values),
      controllers: readControllers(entry.values),
    })
  }
  return [...byAddress.values()]
}

function readControllers(values: Record<string, unknown> | undefined) {
  return [values?.$admin, values?.owner].flat().filter(isAddress)
}

function readSigners(values: Record<string, unknown> | undefined) {
  const threshold = values?.$threshold
  const members = values?.$members
  if (typeof threshold !== 'number' || !Array.isArray(members)) {
    return undefined
  }
  return { threshold, members: members.filter(isAddress) }
}

function isAddress(value: unknown): value is ChainSpecificAddress {
  return typeof value === 'string' && ChainSpecificAddress.check(value)
}
