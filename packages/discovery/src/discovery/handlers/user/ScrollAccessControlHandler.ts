import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { type providers, utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import { FunctionSelectorDecoder } from '../../utils/FunctionSelectorDecoder'
import type { Handler, HandlerResult } from '../Handler'

export type ScrollAccessControlHandlerDefinition = v.infer<
  typeof ScrollAccessControlHandlerDefinition
>
export const ScrollAccessControlHandlerDefinition = v.strictObject({
  type: v.literal('scrollAccessControl'),
  roleNames: v
    .record(
      v.string().check((v) => /^0x[a-f\d]{64}$/i.test(v)),
      v.string(),
    )
    .optional(),
  ignoreRelative: v.boolean().optional(),
})

const abi = new utils.Interface([
  'event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)',
  'event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)',
  'event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)',
  'event GrantAccess(bytes32 indexed role, address indexed target, bytes4[] selectors)',
  'event RevokeAccess(bytes32 indexed role, address indexed target, bytes4[] selectors)',
])

export class ScrollAccessControlHandler implements Handler {
  readonly dependencies: string[] = []
  private readonly knownNames = new Map<string, string>()

  constructor(
    readonly field: string,
    readonly definition: ScrollAccessControlHandlerDefinition,
    abi: string[],
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

  private getRoleName(role: string): string {
    return this.knownNames.get(role) ?? role
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const logs = await provider.getLogs(address, [
      [
        abi.getEventTopic('RoleGranted'),
        abi.getEventTopic('RoleRevoked'),
        abi.getEventTopic('RoleAdminChanged'),
        abi.getEventTopic('GrantAccess'),
        abi.getEventTopic('RevokeAccess'),
      ],
    ])

    const roles: Record<
      string,
      {
        adminRole: string
        members: Set<ChainSpecificAddress>
      }
    > = {}
    const targets: Record<string, Record<string, Set<string>>> = {}

    getRole('DEFAULT_ADMIN_ROLE')

    function getRole(role: string): {
      adminRole: string
      members: Set<ChainSpecificAddress>
    } {
      const value = roles[role] ?? {
        adminRole: 'DEFAULT_ADMIN_ROLE',
        members: new Set(),
      }
      roles[role] = value
      return value
    }

    function getTarget(
      target: ChainSpecificAddress,
    ): Record<string, Set<string>> {
      const value = targets[target.toString()] ?? {}
      targets[target.toString()] = value
      return value
    }

    function getSelector(
      target: Record<string, Set<string>>,
      selector: string,
    ): Set<string> {
      const value = target[selector] ?? new Set()
      target[selector] = value
      return value
    }

    const accessChangeLogs = logs
      .map((v) => parseRoleLog(provider.chain, v))
      .filter((parsed) =>
        ['GrantAccess', 'RevokeAccess'].includes(parsed.type),
      ) as AccessChangeLog[]

    const contracts = new Set<ChainSpecificAddress>(
      accessChangeLogs.map((parsed) => parsed.target),
    )

    const decoder = new FunctionSelectorDecoder(provider)
    await decoder.fetchTargets([...contracts])

    for (const log of logs) {
      const parsed = parseRoleLog(provider.chain, log)
      const role = getRole(this.getRoleName(parsed.role))
      if (parsed.type === 'RoleAdminChanged') {
        role.adminRole = this.getRoleName(parsed.adminRole)
      } else if (parsed.type === 'RoleGranted') {
        role.members.add(parsed.account)
      } else if (parsed.type === 'RoleRevoked') {
        role.members.delete(parsed.account)
      } else if (parsed.type === 'GrantAccess') {
        const target = getTarget(parsed.target)
        const decoded = await Promise.all(
          parsed.selectors.map((s) => decoder.decodeSelector(parsed.target, s)),
        )
        decoded.forEach((s) => {
          if (target[s] === undefined) {
            target[s] = new Set()
          }
        })
        decoded.forEach((s) =>
          getSelector(target, s).add(this.getRoleName(parsed.role)),
        )
      } else if (parsed.type === 'RevokeAccess') {
        const target = getTarget(parsed.target)
        const decoded = await Promise.all(
          parsed.selectors.map((s) => decoder.decodeSelector(parsed.target, s)),
        )
        decoded.forEach((s) => {
          const selector = getSelector(target, s)
          selector.delete(this.getRoleName(parsed.role))
          if (selector.size === 0) {
            delete target[s]
            if (Object.entries(target).length === 0) {
              delete targets[parsed.target.toString()]
            }
          }
        })
      }
    }

    return {
      field: this.field,
      value: {
        roles: Object.fromEntries(
          Object.entries(roles).map(([role, config]) => [
            role,
            {
              adminRole: config.adminRole,
              members: [...config.members].map((x) => x.toString()),
            },
          ]),
        ),
        targets: Object.fromEntries(
          Object.entries(targets).map(([target, selectors]) => [
            target,
            Object.fromEntries(
              Object.entries(selectors).map(([selector, roles]) => [
                selector,
                [...roles],
              ]),
            ),
          ]),
        ),
      },
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}
interface RoleChangeLog {
  readonly type: 'RoleGranted' | 'RoleRevoked'
  readonly role: string
  readonly account: ChainSpecificAddress
  readonly adminRole?: undefined
}
interface RoleAdminChangeLog {
  readonly type: 'RoleAdminChanged'
  readonly role: string
  readonly adminRole: string
  readonly account?: undefined
}
interface AccessChangeLog {
  readonly type: 'GrantAccess' | 'RevokeAccess'
  readonly role: string
  readonly target: ChainSpecificAddress
  readonly selectors: string[]
}
function parseRoleLog(
  longChain: string,
  log: providers.Log,
): RoleChangeLog | RoleAdminChangeLog | AccessChangeLog {
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
  if (event.name === 'GrantAccess' || event.name === 'RevokeAccess') {
    return {
      type: event.name,
      role: event.args.role as string,
      target: ChainSpecificAddress.fromLong(
        longChain,
        event.args.target as string,
      ),
      selectors: event.args.selectors as string[],
    } as const
  }

  return {
    type: 'RoleAdminChanged',
    role: event.args.role as string,
    adminRole: event.args.newAdminRole as string,
  } as const
}
