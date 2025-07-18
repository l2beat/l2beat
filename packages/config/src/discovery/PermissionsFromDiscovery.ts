import type { EntryParameters, ReceivedPermission } from '@l2beat/discovery'
import { type ChainSpecificAddress, formatSeconds } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import sum from 'lodash/sum'
import { UltimatePermissionToPrefix } from './descriptions'
import type { PermissionRegistry } from './PermissionRegistry'
import type { ProjectDiscovery } from './ProjectDiscovery'
import {
  formatPermissionCondition,
  formatPermissionDelay,
  isMultisigLike,
  trimTrailingDots,
} from './utils'

export class PermissionsFromDiscovery implements PermissionRegistry {
  constructor(private readonly projectDiscovery: ProjectDiscovery) {}

  getPermissionedContracts(): ChainSpecificAddress[] {
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

  getPermissionedEoas(): ChainSpecificAddress[] {
    return this.projectDiscovery
      .getEoas()
      .filter((e) => e.receivedPermissions !== undefined)
      .map((e) => e.address)
  }

  describeUpgradePermissions(contractOrEoa: EntryParameters) {
    // Formatting follows: https://docs.l2beat.com/l2b_specs/permissions.html

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
          `* Can upgrade **${delaysString}**`,
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
    // Formatting follows: https://docs.l2beat.com/l2b_specs/permissions.html

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
      return `* Can interact with ${name}\n${permissionsString}`
    })
  }

  describeLegacyPermissions(contractOrEoa: EntryParameters) {
    const excludedPermissions: ReceivedPermission['permission'][] = [
      'act',
      'upgrade',
      'interact',
      'member',
    ] satisfies ReceivedPermission['permission'][]
    const legacyPermissions = (contractOrEoa.receivedPermissions ?? [])
      .filter((p) => !excludedPermissions.includes(p.permission))
      .map((p) => {
        const prefix = UltimatePermissionToPrefix[p.permission]
        const via = this.formatPermissionVia(p)
        return `* ${prefix} ${via}`
      })
    return [...new Set(legacyPermissions)].sort()
  }

  describeRoles(contractOrEoa: EntryParameters) {
    const issued = this.getIssuedPermissions(contractOrEoa.address)
    const roles: Record<string, Record<'direct' | 'ultimate', Set<string>>> = {}

    const result = []
    for (const p of issued) {
      const receiverName = this.projectDiscovery.getName(p.to)
      if (p.role) {
        let text = receiverName
        if (p.condition) {
          text += ` ${formatPermissionCondition(p.condition)}`
        }
        const prettyfiedRole = prettifyRole(p.role)
        roles[prettyfiedRole] ??= {
          direct: new Set(),
          ultimate: new Set(),
        }

        if ((p.via ?? []).length === 0) {
          roles[prettyfiedRole].direct.add(text)
        } else {
          roles[prettyfiedRole].ultimate.add(text)
        }
      }
    }

    const roleNames = Object.keys(roles).sort()
    for (const roleName of roleNames) {
      const direct = Array.from(roles[roleName].direct).sort().join(', ')
      const ultimate = Array.from(roles[roleName].ultimate).sort().join(', ')
      const value = [`  * **${roleName}**: ${direct}`]
      if (ultimate.length > 0) {
        value.push(`; ultimately ${ultimate}`)
      }
      result.push(value.join(''))
    }
    if (result.length > 0) {
      result.unshift('* Roles:')
    }
    return [result.join('\n')]
  }

  describePermissions(
    contractOrEoa: EntryParameters,
    describeRoles = true,
  ): string {
    const upgrade = this.describeUpgradePermissions(contractOrEoa)
    const interact = this.describeInteractPermissions(contractOrEoa)
    const legacy = this.describeLegacyPermissions(contractOrEoa)
    const roles = describeRoles ? this.describeRoles(contractOrEoa) : []
    return [...upgrade, ...interact, ...legacy, ...roles]
      .filter((s) => s !== '')
      .join('\n')
  }

  getUltimatelyIssuedPermissions(fromAddress: ChainSpecificAddress) {
    return this.projectDiscovery
      .getEntries()
      .flatMap((c) =>
        (c.receivedPermissions ?? []).map((p) => ({
          to: c.address,
          ...p,
        })),
      )
      .filter((receivedPermission) => receivedPermission.from === fromAddress)
  }

  getIssuedPermissions(fromAddress: ChainSpecificAddress) {
    return this.projectDiscovery
      .getEntries()
      .flatMap((c) => {
        const allPermissions = [
          ...(c.receivedPermissions ?? []),
          ...(c.directlyReceivedPermissions ?? []),
        ]
        return allPermissions.map((p) => ({
          to: c.address,
          ...p,
        }))
      })
      .filter((receivedPermission) => receivedPermission.from === fromAddress)
  }

  getUpgradableBy(
    contract: EntryParameters,
  ): { name: string; delay: string }[] {
    const issuedPermissions = this.getUltimatelyIssuedPermissions(
      contract.address,
    )

    const upgradersWithDelay: Record<string, number> = Object.fromEntries(
      issuedPermissions
        ?.filter((p) => p.permission === 'upgrade')
        .map((p) => {
          const address = this.projectDiscovery.getName(p.to)
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

function prettifyRole(role: string): string {
  const trimmed = role.replace(/^[.$]+/, '')
  const withoutAcPrefix = trimmed.replace(/^ac/, '')
  const isAllCaps = (s: string) => s === s.toUpperCase()
  if (isAllCaps(withoutAcPrefix)) {
    return withoutAcPrefix.toLowerCase()
  }
  const withoutACSuffix = withoutAcPrefix.replace(/AC$/, '')
  const decapitalized = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)
  return decapitalized(withoutACSuffix)
}
