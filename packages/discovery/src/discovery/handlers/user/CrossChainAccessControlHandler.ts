import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { type providers, utils } from 'ethers'

import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type CrossChainAccessControlHandlerDefinition = v.infer<
  typeof CrossChainAccessControlHandlerDefinition
>
export const CrossChainAccessControlHandlerDefinition = v.strictObject({
  type: v.literal('crossChainAccessControl'),
  roleNames: v
    .record(
      v.string().check((v) => /^0x[a-f\d]{64}$/i.test(v)),
      v.string(),
    )
    .optional(),
  chainAddressNames: v.record(v.string(), v.string()).optional(),
  pickRoleMembers: v.string().optional(),
  pickChainAddress: v.string().optional(),
  ignoreRelative: v.boolean().optional(),
})

const abi = new utils.Interface([
  'event RoleGranted(address indexed chainAddress, bytes32 indexed role, address indexed account)',
  'event RoleRevoked(address indexed chainAddress, bytes32 indexed role, address indexed account)',
  'event RoleAdminChanged(address indexed chainAddress, bytes32 indexed role, bytes32 previousAdminRole, bytes32 newAdminRole)',
])

const DEFAULT_ADMIN_ROLE_BYTES = '0x' + '0'.repeat(64)

export class CrossChainAccessControlHandler implements Handler {
  readonly dependencies: string[] = []
  private readonly knownRoleNames = new Map<string, string>()
  private readonly knownChainAddressNames = new Map<string, string>()

  constructor(
    readonly field: string,
    readonly definition: CrossChainAccessControlHandlerDefinition,
    abi: string[],
  ) {
    this.knownRoleNames.set(DEFAULT_ADMIN_ROLE_BYTES, 'DEFAULT_ADMIN_ROLE')
    for (const [hash, name] of Object.entries(definition.roleNames ?? {})) {
      this.knownRoleNames.set(hash, name)
    }
    for (const [chainAddress, name] of Object.entries(
      definition.chainAddressNames ?? {},
    )) {
      this.knownChainAddressNames.set(chainAddress, name)
    }
    for (const entry of abi) {
      const name = entry.match(/^function (\w+)_ROLE\(\)/)?.[1]
      if (name) {
        const fullName = name + '_ROLE'
        const hash = utils.solidityKeccak256(['string'], [fullName])
        this.knownRoleNames.set(hash, fullName)
      }
    }
  }

  private getRoleName(role: string): string {
    return this.knownRoleNames.get(role) ?? role
  }

  private getChainAddressName(chainAddress: string): string {
    return this.knownChainAddressNames.get(chainAddress) ?? chainAddress
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const unnamedRoles = await fetchAccessControl(provider, address)

    const roles = Object.fromEntries(
      Object.entries(unnamedRoles).map(([chainAddress, rolesConfig]) => {
        return [
          this.getChainAddressName(chainAddress),
          Object.fromEntries(
            Object.entries(rolesConfig).map(([role, value]) => [
              this.getRoleName(role),
              {
                adminRole: this.getRoleName(value.adminRole),
                members: [...value.members].map((x) => x.toString()),
              },
            ]),
          ),
        ]
      }),
    )

    return {
      field: this.field,
      value: this.getValue(roles),
      ignoreRelative: this.definition.ignoreRelative,
    }
  }

  getValue(
    roles: Record<
      ChainSpecificAddress,
      Record<string, { adminRole: string; members: string[] }>
    >,
  ): ContractValue {
    const { pickChainAddress, pickRoleMembers } = this.definition

    if (pickChainAddress !== undefined && pickRoleMembers !== undefined) {
      const chainRoles = roles[pickChainAddress as ChainSpecificAddress]
      assert(
        chainRoles !== undefined,
        `No chain address (${pickChainAddress}) found`,
      )
      assert(
        chainRoles[pickRoleMembers] !== undefined,
        `No role (${pickRoleMembers}) found for chain address (${pickChainAddress})`,
      )
      return chainRoles[pickRoleMembers]['members']
    }

    if (pickChainAddress !== undefined) {
      const chainRoles = roles[pickChainAddress as ChainSpecificAddress]
      assert(
        chainRoles !== undefined,
        `No chain address (${pickChainAddress}) found`,
      )
      return chainRoles
    }

    if (pickRoleMembers !== undefined) {
      const result: Record<string, string[]> = {}
      for (const [chainAddress, chainRoles] of Object.entries(roles)) {
        if (chainRoles[pickRoleMembers] !== undefined) {
          result[chainAddress] = chainRoles[pickRoleMembers]['members']
        }
      }
      assert(
        Object.keys(result).length > 0,
        `No role (${pickRoleMembers}) found in any chain address`,
      )
      return result
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
): Promise<Record<ChainSpecificAddress, Record<string, AccessControlType>>> {
  const logs = await provider.getLogs(address, [
    [
      abi.getEventTopic('RoleGranted'),
      abi.getEventTopic('RoleRevoked'),
      abi.getEventTopic('RoleAdminChanged'),
    ],
  ])

  const roles: Record<
    ChainSpecificAddress,
    Record<
      string,
      {
        adminRole: string
        members: Set<ChainSpecificAddress>
      }
    >
  > = {}

  function getRole(
    chainAddress: ChainSpecificAddress,
    role: string,
  ): {
    adminRole: string
    members: Set<ChainSpecificAddress>
  } {
    const value = roles[chainAddress]?.[role] ?? {
      adminRole: DEFAULT_ADMIN_ROLE_BYTES,
      members: new Set(),
    }
    roles[chainAddress] ??= {}
    roles[chainAddress][role] = value
    return value
  }

  for (const log of logs) {
    const parsed = parseRoleLog(provider.chain, log)
    const role = getRole(parsed.chainAddress, parsed.role)
    if (parsed.type === 'RoleAdminChanged') {
      role.adminRole = parsed.adminRole
    } else if (parsed.type === 'RoleGranted') {
      role.members.add(parsed.account)
    } else {
      role.members.delete(parsed.account)
    }
  }

  return Object.fromEntries(
    Object.entries(roles).map(([chainAddress, rolesConfig]) => [
      chainAddress,
      Object.fromEntries(
        Object.entries(rolesConfig).map(([role, value]) => [
          role,
          {
            adminRole: value.adminRole,
            members: [...value.members].map((x) => x.toString()),
          },
        ]),
      ),
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
      readonly chainAddress: ChainSpecificAddress
      readonly adminRole?: undefined
    }
  | {
      readonly type: 'RoleAdminChanged'
      readonly role: string
      readonly adminRole: string
      readonly chainAddress: ChainSpecificAddress
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
      chainAddress: ChainSpecificAddress.fromLong(
        longChain,
        event.args.chainAddress as string,
      ),
    } as const
  }
  return {
    type: 'RoleAdminChanged',
    role: event.args.role as string,
    adminRole: event.args.newAdminRole as string,
    chainAddress: ChainSpecificAddress.fromLong(
      longChain,
      event.args.chainAddress as string,
    ),
  } as const
}
