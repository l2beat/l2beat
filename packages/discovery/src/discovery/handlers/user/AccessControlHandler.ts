import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { type providers, utils } from 'ethers'

import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type AccessControlHandlerDefinition = v.infer<
  typeof AccessControlHandlerDefinition
>
export const AccessControlHandlerDefinition = v.strictObject({
  type: v.literal('accessControl'),
  roleNames: v
    .record(
      v.string().check((v) => /^0x[a-f\d]{64}$/i.test(v)),
      v.string(),
    )
    .optional(),
  pickRoleMembers: v.string().optional(),
  ignoreRelative: v.boolean().optional(),
})

const abi = new utils.Interface([
  'event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)',
  'event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)',
  'event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)',
])

const DEFAULT_ADMIN_ROLE_BYTES = '0x' + '0'.repeat(64)

export class AccessControlHandler implements Handler {
  readonly dependencies: string[] = []
  private readonly knownNames = new Map<string, string>()

  constructor(
    readonly field: string,
    readonly definition: AccessControlHandlerDefinition,
    abi: string[],
  ) {
    this.knownNames.set(DEFAULT_ADMIN_ROLE_BYTES, 'DEFAULT_ADMIN_ROLE')
    for (const [hash, name] of Object.entries(definition.roleNames ?? {})) {
      this.knownNames.set(hash, name)
    }
    for (const entry of abi) {
      const name = entry.match(/^function (\w+)_ROLE\(\)/)?.[1]
      if (name) {
        const fullName = name + '_ROLE'
        const hash = utils.solidityKeccak256(['string'], [fullName])
        this.knownNames.set(hash, fullName)
      }
    }
  }

  private getRoleName(role: string): string {
    return this.knownNames.get(role) ?? role
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const unnamedRoles = await fetchAccessControl(provider, address)

    const roles = Object.fromEntries(
      Object.entries(unnamedRoles).map(([role, { adminRole, members }]) => {
        return [
          this.getRoleName(role),
          { adminRole: this.getRoleName(adminRole), members },
        ]
      }),
    )

    return {
      field: this.field,
      value: this.getValue(roles),
      ignoreRelative: this.definition.ignoreRelative,
    }
  }

  getValue(roles: Record<string, { members: string[] }>): ContractValue {
    if (this.definition.pickRoleMembers !== undefined) {
      const role = this.definition.pickRoleMembers
      assert(roles[role] !== undefined, `No role (${role}) found`)
      return roles[role]['members']
    }

    return roles
  }
}

export interface AccessControlType {
  readonly adminRole: string
  readonly members: string[]
}

export async function fetchAccessControl(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<Record<string, AccessControlType>> {
  // TODO: (sz-piotr) Promise.all new provider
  const logs = await provider.getLogs(address, [
    [
      abi.getEventTopic('RoleGranted'),
      abi.getEventTopic('RoleRevoked'),
      abi.getEventTopic('RoleAdminChanged'),
    ],
  ])

  const roles: Record<
    string,
    {
      adminRole: string
      members: Set<ChainSpecificAddress>
    }
  > = {}

  getRole(DEFAULT_ADMIN_ROLE_BYTES)

  function getRole(role: string): {
    adminRole: string
    members: Set<ChainSpecificAddress>
  } {
    const value = roles[role] ?? {
      adminRole: DEFAULT_ADMIN_ROLE_BYTES,
      members: new Set(),
    }
    roles[role] = value
    return value
  }

  for (const log of logs) {
    const parsed = parseRoleLog(provider.chain, log)
    const role = getRole(parsed.role)
    if (parsed.type === 'RoleAdminChanged') {
      role.adminRole = parsed.adminRole
    } else if (parsed.type === 'RoleGranted') {
      role.members.add(parsed.account)
    } else {
      role.members.delete(parsed.account)
    }
  }

  return Object.fromEntries(
    Object.entries(roles).map(([role, config]) => [
      role,
      {
        adminRole: config.adminRole,
        members: [...config.members].map((x) => x.toString()),
      },
    ]),
  )
}

function parseRoleLog(
  longChain: string,
  log: providers.Log,
):
  | {
      readonly type: 'RoleGranted' | 'RoleRevoked'
      readonly role: string
      readonly account: ChainSpecificAddress
      readonly adminRole?: undefined
    }
  | {
      readonly type: 'RoleAdminChanged'
      readonly role: string
      readonly adminRole: string
      readonly account?: undefined
    } {
  const event = abi.parseLog(log)
  if (event.name === 'RoleGranted' || event.name === 'RoleRevoked') {
    return {
      type: event.name,
      role: event.args.role as string,
      account: ChainSpecificAddress.fromLong(
        longChain,
        event.args.account as string,
      ),
    } as const
  }
  return {
    type: 'RoleAdminChanged',
    role: event.args.role as string,
    adminRole: event.args.newAdminRole as string,
  } as const
}
