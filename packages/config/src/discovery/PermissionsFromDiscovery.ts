import type { EntryParameters, ReceivedPermission } from '@l2beat/discovery'
import { type EthereumAddress, formatSeconds } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import sum from 'lodash/sum'
import type { PermissionRegistry } from './PermissionRegistry'
import type { ProjectDiscovery } from './ProjectDiscovery'
import { UltimatePermissionToPrefix } from './descriptions'
import {
  formatPermissionCondition,
  formatPermissionDelay,
  isMultisigLike,
  trimTrailingDots,
} from './utils'

export class PermissionsFromDiscovery implements PermissionRegistry {
  constructor(private readonly projectDiscovery: ProjectDiscovery) {}

  getPermissionedContracts(): EthereumAddress[] {
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
    ].map((e) => e.address)
  }

  getPermissionedEoas(): EthereumAddress[] {
    return this.projectDiscovery
      .getEoas()
      .filter((e) => e.receivedPermissions !== undefined)
      .map((e) => e.address)
  }

  describeUpgradePermissions(contractOrEoa: EntryParameters) {
    const upgradePermissions = (contractOrEoa.receivedPermissions ?? []).filter(
      (p) => p.permission === 'upgrade',
    )

    const groupedByTotalDelays = groupBy(
      Object.values(groupBy(upgradePermissions, (p) => p.from)).map(
        (permissions) => ({
          from: permissions[0].from,
          permissionsByDelay: groupBy(permissions, (p) =>
            totalPermissionDelay(p),
          ),
        }),
      ),
      (permission) =>
        Object.keys(permission.permissionsByDelay).sort().join('►'),
    )

    return Object.entries(groupedByTotalDelays).map(
      ([delays, permissionsByDelay]) => {
        const delaysString = delays
          .split('►')
          .map((d) => formatPermissionDelay(Number(d)))
          .join(' or ')
        return [
          `Can upgrade **${delaysString}**`,
          ...Object.values(permissionsByDelay).map((p) => {
            const name = this.projectDiscovery.getContract(p.from).name
            const vias = Object.values(p.permissionsByDelay).map((p) =>
              this.formatMultiplePermissionsVia(p),
            )
            return `  * ${name} ${vias.join(' - or ')}`
          }),
        ].join('\n')
      },
    )
  }

  describeInteractPermissions(contractOrEoa: EntryParameters) {
    const interactPermissions = (
      contractOrEoa.receivedPermissions ?? []
    ).filter((p) => p.permission === 'interact')

    const groupedByGiver = groupBy(interactPermissions, (p) => p.from)

    return Object.entries(groupedByGiver).map(([from, permissions]) => {
      const name = this.projectDiscovery.getContract(from).name
      const permissionsString = Object.entries(
        groupBy(permissions, (p) => p.description),
      )
        .map(([description, permissions]) => {
          const result = [`  * ${trimTrailingDots(description)}`]
          const sumTotalDelays = sum(
            permissions.map((p) => totalPermissionDelay(p)),
          )
          if (sumTotalDelays > 0) {
            result.push(
              `**${permissions.map((p) => formatPermissionDelay(totalPermissionDelay(p))).join(' or ')}**`,
            )
          }
          result.push(this.formatMultiplePermissionsVia(permissions))
          return result.join(' ')
        })
        .join('\n')
      return `Can interact with ${name}\n${permissionsString}`
    })
  }

  describeLegacyPermissions(contractOrEoa: EntryParameters) {
    const excludedPermissions: ReceivedPermission['permission'][] = [
      'act',
      'upgrade',
      'interact',
      'member',
    ] satisfies ReceivedPermission['permission'][]
    return (contractOrEoa.receivedPermissions ?? [])
      .filter((p) => !excludedPermissions.includes(p.permission))
      .map((p) => {
        const prefix = UltimatePermissionToPrefix[p.permission]
        const via = this.formatPermissionVia(p)
        return `${prefix} ${via}`
      })
  }

  describePermissions(
    contractOrEoa: EntryParameters,
    _includeDirectPermissions: boolean = true,
  ) {
    const upgrade = this.describeUpgradePermissions(contractOrEoa)
    const interact = this.describeInteractPermissions(contractOrEoa)
    const legacy = this.describeLegacyPermissions(contractOrEoa)
    return [...upgrade, ...interact, ...legacy].filter((s) => s !== '')
  }

  getUpgradableBy(
    contract: EntryParameters,
  ): { name: string; delay: string }[] {
    const issuedPermissions = this.projectDiscovery
      .getEntries()
      .flatMap((c) =>
        (c.receivedPermissions ?? []).map((p) => ({
          to: c.address,
          ...p,
        })),
      )
      .filter(
        (receivedPermission) => receivedPermission.from === contract.address,
      )

    const upgradersWithDelay: Record<string, number> = Object.fromEntries(
      issuedPermissions
        ?.filter((p) => p.permission === 'upgrade')
        .map((p) => {
          const entry = this.projectDiscovery.getEntryByAddress(p.to)
          const address =
            entry?.name ??
            (this.projectDiscovery.isEOA(p.to)
              ? this.projectDiscovery.getEOAName(p.to)
              : p.to.toString())
          const delay =
            (p.delay ?? 0) + sum(p.via?.map((v) => v.delay ?? 0) ?? [])
          return [address, delay]
        }) ?? [],
    )

    return Object.keys(upgradersWithDelay).map((actor) => ({
      name: actor,
      delay:
        upgradersWithDelay[actor] === 0
          ? 'no'
          : formatSeconds(upgradersWithDelay[actor]),
    }))
  }

  formatMultiplePermissionsVia(permissions: ReceivedPermission[]) {
    const sumTotalDelays = sum(permissions.map((p) => totalPermissionDelay(p)))
    const sumAllVias = sum(permissions.map((p) => p.via?.length ?? 0))
    if (sumTotalDelays === 0 && sumAllVias === 0) {
      return ''
    }
    const result = permissions
      .map((p) => this.formatPermissionVia(p))
      .join(' - or ')
    return `[via: ${result}]`
  }

  formatPermissionVia(receivedPermission: ReceivedPermission) {
    const reversedVia = [...(receivedPermission.via ?? [])].reverse()
    const result = []
    if (reversedVia.length > 0) {
      result.push('- acting via')
      result.push(
        reversedVia
          .map((p) => this.projectDiscovery.formatViaPath(p))
          .join(' → '),
      )
    } else {
      result.push('- acting directly')
    }
    // if via is empty, there still may be a direct delay or condition:
    if (receivedPermission.delay) {
      result.push(formatPermissionDelay(receivedPermission.delay))
    }
    if (receivedPermission.condition) {
      result.push(formatPermissionCondition(receivedPermission.condition))
    }
    return result.join(' ')
  }
}

function totalPermissionDelay(p: ReceivedPermission): number {
  return (p.delay ?? 0) + sum((p.via ?? []).map((v) => v.delay ?? 0))
}
