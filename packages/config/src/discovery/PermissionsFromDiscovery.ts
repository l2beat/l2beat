import type {
  ContractParameters,
  EoaParameters,
  Permission,
  ReceivedPermission,
  ResolvedPermissionPath,
} from '@l2beat/discovery'
import { notUndefined } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import type { PermissionRegistry } from './PermissionRegistry'
import type { ProjectDiscovery } from './ProjectDiscovery'
import {
  DirectPermissionToPrefix,
  UltimatePermissionToPrefix,
} from './descriptions'
import {
  formatPermissionCondition,
  formatPermissionDelay,
  formatPermissionDescription,
  isMultisigLike,
} from './utils'

export class PermissionsFromDiscovery implements PermissionRegistry {
  constructor(private readonly projectDiscovery: ProjectDiscovery) {}

  getPermissionedContracts(): ContractParameters[] {
    const contracts = this.projectDiscovery.getContracts()

    return [
      ...contracts.filter(
        (contract) => contract.receivedPermissions !== undefined,
      ),
      // We show multisigs even without ultimate permissions,
      // because they can be members of msigs with permissions.
      // We can also assume that msigs are always permissioned.
      // But we show them last.
      ...contracts.filter(
        (contract) =>
          contract.receivedPermissions === undefined &&
          isMultisigLike(contract),
      ),
    ]
      .filter((e) => (e.category?.priority ?? 0) >= 0)
      .sort((a, b) => {
        return this.getPermissionPriority(b) - this.getPermissionPriority(a)
      })
  }

  getPermissionedEoas(): EoaParameters[] {
    return this.projectDiscovery
      .getEoas()
      .filter((e) => (e.category?.priority ?? 0) >= 0)
      .sort((a, b) => {
        return this.getPermissionPriority(b) - this.getPermissionPriority(a)
      })
  }
  describePermissions(
    contractOrEoa: ContractParameters | EoaParameters,
    includeDirectPermissions: boolean = true,
  ) {
    return [
      ...(includeDirectPermissions
        ? this.describeDirectlyReceivedPermissions(contractOrEoa)
        : []),
      ...this.describeUltimatelyReceivedPermissions(contractOrEoa),
    ].filter(notUndefined)
  }

  getPermissionPriority(entry: ContractParameters | EoaParameters): number {
    if (entry.receivedPermissions === undefined) {
      return 0
    }

    const permissions = entry.receivedPermissions.map((p) => p.from)
    const priority = permissions.reduce((acc, permission) => {
      return (
        acc +
        (this.projectDiscovery.getEntryByAddress(permission)?.category
          ?.priority ?? 0)
      )
    }, 0)

    return priority
  }

  describeDirectlyReceivedPermissions(
    contractOrEoa: ContractParameters | EoaParameters,
  ): string[] {
    return Object.entries(
      groupBy(
        contractOrEoa.directlyReceivedPermissions ?? [],
        (value: ReceivedPermission) =>
          [
            value.permission,
            value.description ?? '',
            value.condition ?? '',
            value.delay?.toString() ?? '',
          ].join('►'),
      ),
    ).map(([key, entries]) => {
      const permission = key.split('►')[0] as Permission
      const description = key.split('►')[1] ?? ''
      const condition = key.split('►')[2] ?? ''
      const delay = key.split('►')[3] ?? ''
      const permissionsRequiringTarget: Permission[] = [
        'interact',
        'upgrade',
        'act',
      ]
      const showTargets = permissionsRequiringTarget.includes(permission)
      const addressesString = showTargets
        ? entries
            .map(
              (entry) =>
                this.projectDiscovery.getContract(entry.from.toString()).name,
            )
            .join(', ')
        : ''

      return `${[
        DirectPermissionToPrefix[permission],
        addressesString,
        formatPermissionDescription(description),
        formatPermissionCondition(condition),
        delay === '' ? '' : formatPermissionDelay(Number(delay)),
      ]
        .filter((s) => s !== '')
        .join(' ')
        .trim()}.`
    })
  }

  describeUltimatelyReceivedPermissions(
    contractOrEoa: ContractParameters | EoaParameters,
  ): string[] {
    const formatVia = (via: ResolvedPermissionPath[]) =>
      `- acting via ${via.map((p) => this.projectDiscovery.formatViaPath(p)).join(', ')}`

    return Object.entries(
      groupBy(
        contractOrEoa.receivedPermissions ?? [],
        (value: ReceivedPermission) => {
          return [
            value.permission,
            value.via !== undefined ? formatVia(value.via) : '',
            value.description ?? '',
            value.condition ?? '',
            value.delay?.toString() ?? '',
          ].join('►')
        },
      ),
    ).map(([key, entries]) => {
      const permission = key.split('►')[0] as Permission
      const via = key.split('►')[1] ?? ''
      const description = key.split('►')[2] ?? ''
      const condition = key.split('►')[3] ?? ''
      const delay = key.split('►')[4] ?? ''
      const prefix = UltimatePermissionToPrefix[permission]
      if (prefix === undefined) {
        return ''
      }

      const permissionsRequiringTarget: Permission[] = [
        'interact',
        'upgrade',
        'act',
      ]
      const showTargets = permissionsRequiringTarget.includes(permission)
      const addressesString = showTargets
        ? entries
            .map(
              (entry) =>
                this.projectDiscovery.getContract(entry.from.toString()).name,
            )
            .join(', ')
        : ''

      return `${[
        UltimatePermissionToPrefix[permission as Permission],
        addressesString,
        formatPermissionDescription(description),
        formatPermissionCondition(condition),
        delay === '' ? '' : formatPermissionDelay(Number(delay)),
        via,
      ]
        .filter((s) => s !== '')
        .join(' ')
        .trim()}.`
    })
  }
}
