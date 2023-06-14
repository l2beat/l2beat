import { EthereumAddress } from '@l2beat/shared-pure'
import { providers, utils } from 'ethers'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { Handler, HandlerResult } from '../Handler'

export type AccessControlHandlerDefinition = z.infer<
  typeof AccessControlHandlerDefinition
>
export const AccessControlHandlerDefinition = z.strictObject({
  type: z.literal('accessControl'),
  roleNames: z.optional(
    z.record(z.string().regex(/^0x[a-f\d]{64}$/i), z.string()),
  ),
  ignoreRelative: z.optional(z.boolean()),
})

const abi = new utils.Interface([
  'event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)',
  'event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)',
  'event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)',
])

export class AccessControlHandler implements Handler {
  readonly dependencies: string[] = []
  private readonly knownNames = new Map<string, string>()

  constructor(
    readonly field: string,
    readonly definition: AccessControlHandlerDefinition,
    abi: string[],
    readonly logger: DiscoveryLogger,
  ) {
    this.knownNames.set('0x' + '0'.repeat(64), 'DEFAULT_ADMIN_ROLE')
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

  private getRoleName(role: string) {
    return this.knownNames.get(role) ?? role
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, ['Checking AccessControl'])
    const logs = await provider.getLogs(
      address,
      [
        [
          abi.getEventTopic('RoleGranted'),
          abi.getEventTopic('RoleRevoked'),
          abi.getEventTopic('RoleAdminChanged'),
        ],
      ],
      0,
      blockNumber,
    )

    const roles: Record<
      string,
      {
        adminRole: string
        members: Set<EthereumAddress>
      }
    > = {}

    getRole('DEFAULT_ADMIN_ROLE')

    function getRole(role: string) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const value = roles[role] ?? {
        adminRole: 'DEFAULT_ADMIN_ROLE',
        members: new Set(),
      }
      roles[role] = value
      return value
    }

    for (const log of logs) {
      const parsed = parseRoleLog(log)
      const role = getRole(this.getRoleName(parsed.role))
      if (parsed.type === 'RoleAdminChanged') {
        role.adminRole = this.getRoleName(parsed.adminRole)
      } else if (parsed.type === 'RoleGranted') {
        role.members.add(parsed.account)
      } else {
        role.members.delete(parsed.account)
      }
    }

    return {
      field: this.field,
      value: Object.fromEntries(
        Object.entries(roles).map(([role, config]) => [
          role,
          {
            adminRole: config.adminRole,
            members: [...config.members].map((x) => x.toString()),
          },
        ]),
      ),
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}

function parseRoleLog(log: providers.Log) {
  const event = abi.parseLog(log)
  if (event.name === 'RoleGranted' || event.name === 'RoleRevoked') {
    return {
      type: event.name,
      role: event.args.role as string,
      account: EthereumAddress(event.args.account as string),
    } as const
  }
  return {
    type: 'RoleAdminChanged',
    role: event.args.role as string,
    adminRole: event.args.newAdminRole as string,
  } as const
}
