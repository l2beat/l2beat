import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { utils } from 'ethers'

import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type AragonPermissionsHandlerDefinition = v.infer<
  typeof AragonPermissionsHandlerDefinition
>
export const AragonPermissionsHandlerDefinition = v.strictObject({
  type: v.literal('aragonPermissions'),
  roleNames: v
    .record(
      v.string().check((v) => /^0x[a-f\d]{64}$/i.test(v)),
      v.string(),
    )
    .optional(),
  pickRoleMembers: v.string().optional(),
  ignoreRelative: v.boolean().optional(),
})

const aclAbi = new utils.Interface([
  'event SetPermission(address indexed entity, address indexed app, bytes32 indexed role, bool allowed)',
  'event ChangePermissionManager(address indexed app, bytes32 indexed role, address indexed manager)',
])

const KERNEL_METHOD = 'function kernel() view returns (address)'
const ACL_METHOD = 'function acl() view returns (address)'

export class AragonPermissionsHandler implements Handler {
  readonly dependencies: string[] = []
  private readonly knownNames = new Map<string, string>()

  constructor(
    readonly field: string,
    readonly definition: AragonPermissionsHandlerDefinition,
    abi: string[],
  ) {
    const explicitlyNamedRoles = new Set(
      Object.values(definition.roleNames ?? {}),
    )
    for (const [hash, name] of Object.entries(definition.roleNames ?? {})) {
      this.knownNames.set(hash.toLowerCase(), name)
    }
    for (const entry of abi) {
      const name = entry.match(/^function (\w+)_ROLE\(\)/)?.[1]
      if (name) {
        const fullName = name + '_ROLE'
        if (explicitlyNamedRoles.has(fullName)) {
          continue
        }
        const hash = utils.solidityKeccak256(['string'], [fullName])
        this.knownNames.set(hash.toLowerCase(), fullName)
      }
    }
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const kernelAddress = await getKernelAddress(provider, address)
    if (kernelAddress === undefined) {
      return { field: this.field, error: 'kernel() and acl() reverted' }
    }

    const aclAddress = await getAclAddress(provider, kernelAddress)
    if (aclAddress === undefined) {
      return { field: this.field, error: 'acl() reverted' }
    }

    const roles = await fetchAragonPermissions(provider, aclAddress, address)
    for (const role of this.knownNames.keys()) {
      roles[role] ??= { members: [], managers: [] }
    }
    const namedRoles = Object.fromEntries(
      Object.entries(roles).map(([role, value]) => [
        this.knownNames.get(role.toLowerCase()) ?? role,
        value,
      ]),
    )

    return {
      field: this.field,
      value: this.getValue(namedRoles),
      ignoreRelative: this.definition.ignoreRelative,
    }
  }

  getValue(
    roles: Record<string, { members: string[]; managers: string[] }>,
  ): ContractValue {
    if (this.definition.pickRoleMembers !== undefined) {
      const role = this.definition.pickRoleMembers
      assert(roles[role] !== undefined, `No role (${role}) found`)
      return roles[role].members
    }
    return roles
  }
}

async function getKernelAddress(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ChainSpecificAddress | undefined> {
  const kernel = await provider.callMethod<string>(address, KERNEL_METHOD, [])
  if (kernel !== undefined) {
    return ChainSpecificAddress.fromLong(provider.chain, kernel)
  }

  const acl = await provider.callMethod<string>(address, ACL_METHOD, [])
  return acl === undefined ? undefined : address
}

async function getAclAddress(
  provider: IProvider,
  kernelAddress: ChainSpecificAddress,
): Promise<ChainSpecificAddress | undefined> {
  const acl = await provider.callMethod<string>(kernelAddress, ACL_METHOD, [])
  return acl === undefined
    ? undefined
    : ChainSpecificAddress.fromLong(provider.chain, acl)
}

interface AragonRole {
  members: Set<ChainSpecificAddress>
  manager?: ChainSpecificAddress
}

export async function fetchAragonPermissions(
  provider: IProvider,
  aclAddress: ChainSpecificAddress,
  appAddress: ChainSpecificAddress,
): Promise<Record<string, { members: string[]; managers: string[] }>> {
  const logs = await provider.getLogs(aclAddress, [
    [
      aclAbi.getEventTopic('SetPermission'),
      aclAbi.getEventTopic('ChangePermissionManager'),
    ],
  ])

  const app = ChainSpecificAddress.address(appAddress).toLowerCase()
  const roles: Record<string, AragonRole> = {}

  function getRole(role: string): AragonRole {
    const normalized = role.toLowerCase()
    const value = roles[normalized] ?? { members: new Set() }
    roles[normalized] = value
    return value
  }

  for (const log of logs) {
    const event = aclAbi.parseLog(log)
    if (String(event.args.app).toLowerCase() !== app) {
      continue
    }

    const role = getRole(event.args.role as string)
    if (event.name === 'SetPermission') {
      const member = ChainSpecificAddress.fromLong(
        provider.chain,
        event.args.entity as string,
      )
      if (event.args.allowed as boolean) {
        role.members.add(member)
      } else {
        role.members.delete(member)
      }
    } else {
      const manager = event.args.manager as string
      role.manager =
        manager === utils.getAddress('0x' + '0'.repeat(40))
          ? undefined
          : ChainSpecificAddress.fromLong(provider.chain, manager)
    }
  }

  return Object.fromEntries(
    Object.entries(roles).map(([role, value]) => [
      role,
      {
        members: [...value.members].map((x) => x.toString()),
        managers: value.manager === undefined ? [] : [value.manager.toString()],
      },
    ]),
  )
}
