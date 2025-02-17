import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { type providers, utils } from 'ethers'
import * as z from 'zod'

import type { IProvider } from '../../provider/IProvider'
import { FunctionSelectorDecoder } from '../../utils/FunctionSelectorDecoder'
import type { Handler, HandlerResult } from '../Handler'

export type KintoAccessControlHandlerDefinition = z.infer<
  typeof KintoAccessControlHandlerDefinition
>
export const KintoAccessControlHandlerDefinition = z.strictObject({
  type: z.literal('kintoAccessControl'),
  roleNames: z.optional(
    z.record(z.string().regex(/^0x[a-f\d]*$/i), z.string()),
  ),
  ignoreRelative: z.optional(z.boolean()),
})

const abi = new utils.Interface([
  'event RoleLabel(uint64 indexed roleId, string label)',
  'event RoleGranted(uint64 indexed roleId, address indexed account, uint32 delay, uint48 since, bool newMember)',
  'event RoleRevoked(uint64 indexed roleId, address indexed account)',
  'event RoleAdminChanged(uint64 indexed roleId, uint64 indexed admin)',
  'event RoleGuardianChanged(uint64 indexed roleId, uint64 indexed guardian)',
  'event RoleGrantDelayChanged(uint64 indexed roleId, uint32 delay, uint48 since)',

  'event TargetClosed(address indexed target, bool closed)',
  'event TargetFunctionRoleUpdated(address indexed target, bytes4 selector, uint64 indexed roleId)',
  'event TargetAdminDelayUpdated(address indexed target, uint32 delay, uint48 since)',
])

export class KintoAccessControlHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: KintoAccessControlHandlerDefinition,
    _: string[],
  ) {}

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const labels = await this.fetchLabels(
      provider,
      address,
      this.definition.roleNames ?? {},
    )

    const roles = await this.fetchRoles(provider, address, labels)
    const targets = await this.fetchTargets(provider, address, labels)

    return {
      field: this.field,
      value: {
        roles: Object.fromEntries(
          Object.entries(roles).map(([role, config]) => [
            role,
            {
              ...config,
              members: [...config.members.keys()].map((k) => ({
                member: k,
                ...config.members.get(k),
              })),
            },
          ]),
        ),
        targets,
      },
      ignoreRelative: this.definition.ignoreRelative,
    }
  }

  private async fetchLabels(
    provider: IProvider,
    address: EthereumAddress,
    userLabels: Record<string, string>,
  ) {
    const rawLogs = await provider.getLogs(address, [
      [abi.getEventTopic('RoleLabel')],
    ])

    const labels: Record<string, string> = {
      '0x00': 'ADMIN_ROLE',
    }
    const logs = rawLogs
      .map((l) => parseRoleLog(l))
      .filter((l) => l.type === 'RoleLabel')

    for (const { role, label } of logs) {
      labels[role] = label
    }

    for (const roleIdHex in userLabels) {
      // biome-ignore lint/style/noNonNullAssertion: We know it's there
      const userLabel = userLabels[roleIdHex]!
      labels[roleIdHex] = userLabel
    }

    return labels
  }

  private async fetchRoles(
    provider: IProvider,
    address: EthereumAddress,
    labels: Record<string, string>,
  ) {
    const rawLogs = await provider.getLogs(address, [
      [
        abi.getEventTopic('RoleGranted'),
        abi.getEventTopic('RoleRevoked'),
        abi.getEventTopic('RoleAdminChanged'),
        abi.getEventTopic('RoleGuardianChanged'),
        abi.getEventTopic('RoleGrantDelayChanged'),
      ],
    ])

    const logs = rawLogs.map((l) => parseRoleLog(l))

    const roles: Record<
      string,
      {
        admin?: EthereumAddress
        guardian?: EthereumAddress
        grantDelay?: number
        members: Map<string, { executionDelay: number; since: number }>
      }
    > = {}

    for (const log of logs) {
      assert(log.type !== 'RoleLabel')

      const key = labels[log.role] ?? log.role
      roles[key] ??= {
        members: new Map(),
      }

      switch (log.type) {
        case 'RoleGranted': {
          roles[key].members.set(log.account, {
            since: log.since,
            executionDelay: log.delay,
          })
          break
        }
        case 'RoleRevoked': {
          roles[key].members.delete(log.account)
          break
        }
        case 'RoleAdminChanged': {
          roles[key].admin = EthereumAddress(log.account)
          break
        }
        case 'RoleGuardianChanged': {
          roles[key].guardian = EthereumAddress(log.account)
          break
        }
        case 'RoleGrantDelayChanged': {
          roles[key].grantDelay = log.delay
          break
        }
      }
    }

    return roles
  }

  private async fetchTargets(
    provider: IProvider,
    address: EthereumAddress,
    labels: Record<string, string>,
  ) {
    const rawLogs = await provider.getLogs(address, [
      [
        abi.getEventTopic('TargetClosed'),
        abi.getEventTopic('TargetFunctionRoleUpdated'),
        abi.getEventTopic('TargetAdminDelayUpdated'),
      ],
    ])

    const logs = rawLogs.map((l) => parseTargetLog(l))

    const targets: Record<
      string,
      {
        roleFunctions: Record<string, string[]>
        adminDelay?: number
        closed?: boolean
      }
    > = {}

    const contracts = new Set<EthereumAddress>(logs.map((l) => l.target))
    const decoder = new FunctionSelectorDecoder(provider)
    await decoder.fetchTargets([...contracts])

    for (const log of logs) {
      const key = log.target.toString()
      targets[key] ??= {
        roleFunctions: {},
      }

      switch (log.type) {
        case 'TargetClosed': {
          targets[key].closed = log.closed
          break
        }
        case 'TargetFunctionRoleUpdated': {
          const roleKey = labels[log.role] ?? log.role
          const selector = await decoder.decodeSelector(
            log.target,
            log.selector,
          )

          targets[key].roleFunctions[roleKey] ??= []
          targets[key].roleFunctions[roleKey].push(selector)
          break
        }
        case 'TargetAdminDelayUpdated': {
          targets[key].adminDelay = log.delay
          break
        }
      }
    }

    return targets
  }
}

interface RoleLabelLog {
  readonly type: 'RoleLabel'
  readonly role: string
  readonly label: string
}
interface RoleGrantedLog {
  readonly type: 'RoleGranted'
  readonly role: string
  readonly account: EthereumAddress
  readonly delay: number
  readonly since: number
}
interface RoleRevokedLog {
  readonly type: 'RoleRevoked'
  readonly role: string
  readonly account: EthereumAddress
}
interface RoleAdminChangeLog {
  readonly type: 'RoleAdminChanged'
  readonly role: string
  readonly account: string
}
interface RoleGuardianChangeLog {
  readonly type: 'RoleGuardianChanged'
  readonly role: string
  readonly account: string
}
interface RoleGrantDelayChangeLog {
  readonly type: 'RoleGrantDelayChanged'
  readonly role: string
  readonly delay: number
  readonly since: number
}

function parseRoleLog(
  log: providers.Log,
):
  | RoleLabelLog
  | RoleGrantedLog
  | RoleRevokedLog
  | RoleAdminChangeLog
  | RoleGuardianChangeLog
  | RoleGrantDelayChangeLog {
  const event = abi.parseLog(log)
  switch (event.name) {
    case 'RoleLabel':
      return {
        type: event.name,
        role: event.args.roleId.toHexString(),
        label: event.args.label as string,
      } as const
    case 'RoleGranted':
      return {
        type: event.name,
        role: event.args.roleId.toHexString(),
        account: EthereumAddress(event.args.account as string),
        delay: event.args.delay,
        since: event.args.since,
      } as const
    case 'RoleRevoked':
      return {
        type: event.name,
        role: event.args.roleId.toHexString(),
        account: EthereumAddress(event.args.account as string),
      } as const
    case 'RoleAdminChanged':
      return {
        type: event.name,
        role: event.args.roleId.toString(16),
        account: EthereumAddress(event.args.admin as string),
      } as const
    case 'RoleGuardianChanged':
      return {
        type: event.name,
        role: event.args.roleId.toHexString(),
        account: EthereumAddress(event.args.guardian as string),
      } as const
    default:
      return {
        type: 'RoleGrantDelayChanged',
        role: event.args.roleId.toHexString(),
        delay: event.args.delay as number,
        since: event.args.since as number,
      } as const
  }
}

interface TargetClosedLog {
  readonly type: 'TargetClosed'
  readonly target: EthereumAddress
  readonly closed: boolean
}
interface TargetFunctionRoleUpdatedLog {
  readonly type: 'TargetFunctionRoleUpdated'
  readonly target: EthereumAddress
  readonly selector: string
  readonly role: string
}
interface TargetAdminDelayUpdatedLog {
  readonly type: 'TargetAdminDelayUpdated'
  readonly target: EthereumAddress
  readonly delay: number
  readonly since: number
}

function parseTargetLog(
  log: providers.Log,
): TargetClosedLog | TargetFunctionRoleUpdatedLog | TargetAdminDelayUpdatedLog {
  const event = abi.parseLog(log)
  switch (event.name) {
    case 'TargetClosed':
      return {
        type: event.name,
        target: EthereumAddress(event.args.target),
        closed: event.args.closed,
      } as const
    case 'TargetFunctionRoleUpdated':
      return {
        type: event.name,
        target: EthereumAddress(event.args.target),
        selector: event.args.selector,
        role: event.args.roleId.toHexString(),
      } as const
    default:
      return {
        type: 'TargetAdminDelayUpdated',
        target: EthereumAddress(event.args.target),
        delay: event.args.delay as number,
        since: event.args.since as number,
      } as const
  }
}
