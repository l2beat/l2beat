import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { type providers, utils } from 'ethers'

import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type LidoACLHandlerDefinition = v.infer<typeof LidoACLHandlerDefinition>
export const LidoACLHandlerDefinition = v.strictObject({
  type: v.literal('lidoACL'),
  roleNames: v
    .record(
      v.string().check((v) => /^0x[a-f\d]{64}$/i.test(v)),
      v.string(),
    )
    .optional(),
  ignoreRelative: v.boolean().optional(),
  ignoreRelatives: v
    .array(
      v.strictObject({
        app: v.string(),
        role: v.string(),
      }),
    )
    .optional(),
})

const abi = new utils.Interface([
  'event SetPermission(address indexed entity, address indexed app, bytes32 indexed role, bool allowed)',
  'event SetPermissionParams(address indexed entity, address indexed app, bytes32 indexed role, bytes32 paramsHash)',
  'event ChangePermissionManager(address indexed app, bytes32 indexed role, address indexed manager)',
])

export class LidoACLHandler implements Handler {
  readonly dependencies: string[] = []
  private readonly knownNames = new Map<string, string>()

  constructor(
    readonly field: string,
    readonly definition: LidoACLHandlerDefinition,
    abi: string[],
  ) {
    // Known Lido role
    this.knownNames.set(
      '0x0b719b33c83b8e5d300c521cb8b54ae9bd933996a14bef8c2f4e0285d2d2400a',
      'CREATE_PERMISSIONS_ROLE',
    )

    // Add user-provided role names
    for (const [hash, name] of Object.entries(definition.roleNames ?? {})) {
      this.knownNames.set(hash, name)
    }

    // Auto-detect roles from ABI (pattern: function ROLE_NAME() returns (bytes32))
    for (const entry of abi) {
      const match = entry.match(/^function (\w+_ROLE)\(\)/)
      if (match && match[1]) {
        const roleName = match[1]
        const hash = utils.solidityKeccak256(['string'], [roleName])
        this.knownNames.set(hash, roleName)
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
    const permissions = await fetchLidoACLPermissions(
      provider,
      address,
      this.getRoleName.bind(this),
    )

    // Build set of permissions to ignore as relatives
    const ignoreRelativesSet = new Set<string>()
    if (this.definition.ignoreRelatives) {
      for (const { app, role } of this.definition.ignoreRelatives) {
        ignoreRelativesSet.add(`${app}_${role}`)
      }
    }

    // Build nested structure: { app: { role: { role, manager, entities } } }
    const nestedPermissions: Record<string, Record<string, any>> = {}

    for (const [key, permission] of Object.entries(permissions)) {
      const app = permission.app
      const roleHash = permission.role

      if (!nestedPermissions[app]) {
        nestedPermissions[app] = {}
      }

      if (ignoreRelativesSet.has(key)) {
        // Remove entities array so they won't be discovered as relatives
        nestedPermissions[app][roleHash] = {
          manager: permission.manager,
          entityCount: permission.entities.length,
        }
      } else {
        nestedPermissions[app][roleHash] = {
          manager: permission.manager,
          entities: permission.entities,
        }
      }
    }

    return {
      field: this.field,
      value: nestedPermissions as unknown as ContractValue,
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}

export interface LidoACLPermission {
  readonly app: string
  readonly role: string
  readonly manager: string
  readonly entities: string[]
  readonly ignoreRelative?: boolean
}

export async function fetchLidoACLPermissions(
  provider: IProvider,
  address: ChainSpecificAddress,
  getRoleName: (role: string) => string,
): Promise<Record<string, LidoACLPermission>> {
  const logs = await provider.getLogs(address, [
    [
      abi.getEventTopic('SetPermission'),
      abi.getEventTopic('ChangePermissionManager'),
    ],
  ])

  // Map: (app + role) => { app, role, manager, entities }
  const permissions: Record<
    string,
    {
      app: ChainSpecificAddress
      role: string
      manager: ChainSpecificAddress | undefined
      entities: Set<ChainSpecificAddress>
    }
  > = {}

  function getPermissionKey(app: string, role: string): string {
    return `${app}_${role}`
  }

  function getPermission(app: ChainSpecificAddress, role: string) {
    const key = getPermissionKey(app.toString(), role)
    const value = permissions[key] ?? {
      app,
      role,
      manager: undefined,
      entities: new Set(),
    }
    permissions[key] = value
    return value
  }

  for (const log of logs) {
    const parsed = parseACLLog(provider.chain, log)

    if (parsed.type === 'SetPermission') {
      const permission = getPermission(parsed.app, parsed.role)
      if (parsed.allowed) {
        permission.entities.add(parsed.entity)
      } else {
        permission.entities.delete(parsed.entity)
      }
    } else if (parsed.type === 'ChangePermissionManager') {
      const permission = getPermission(parsed.app, parsed.role)
      permission.manager = parsed.manager
    }
  }

  // Filter out permissions with no entities and convert to final format
  return Object.fromEntries(
    Object.entries(permissions)
      .filter(([_, config]) => config.entities.size > 0)
      .map(([key, config]) => [
        key,
        {
          app: config.app.toString(),
          role: getRoleName(config.role),
          manager: config.manager?.toString() ?? 'none',
          entities: [...config.entities].map((x) => x.toString()),
        },
      ]),
  )
}

function parseACLLog(
  longChain: string,
  log: providers.Log,
):
  | {
      readonly type: 'SetPermission'
      readonly entity: ChainSpecificAddress
      readonly app: ChainSpecificAddress
      readonly role: string
      readonly allowed: boolean
    }
  | {
      readonly type: 'ChangePermissionManager'
      readonly app: ChainSpecificAddress
      readonly role: string
      readonly manager: ChainSpecificAddress
    } {
  const event = abi.parseLog(log)

  if (event.name === 'SetPermission') {
    return {
      type: 'SetPermission',
      entity: ChainSpecificAddress.fromLong(
        longChain,
        event.args.entity as string,
      ),
      app: ChainSpecificAddress.fromLong(longChain, event.args.app as string),
      role: event.args.role as string,
      allowed: event.args.allowed as boolean,
    } as const
  }

  // ChangePermissionManager
  return {
    type: 'ChangePermissionManager',
    app: ChainSpecificAddress.fromLong(longChain, event.args.app as string),
    role: event.args.role as string,
    manager: ChainSpecificAddress.fromLong(
      longChain,
      event.args.manager as string,
    ),
  } as const
}
