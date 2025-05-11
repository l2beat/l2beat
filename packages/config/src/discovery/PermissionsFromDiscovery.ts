import type {
  EntryParameters,
  Permission,
  ReceivedPermission,
  ResolvedPermissionPath,
} from '@l2beat/discovery'
import {
  type EthereumAddress,
  formatSeconds,
  notUndefined,
} from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import sum from 'lodash/sum'
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
import { chain } from 'lodash'
import { permission } from 'process'

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

  describePermissions(
    contractOrEoa: EntryParameters,
    includeDirectPermissions: boolean = true,
  ) {
    const totalViaDelay = (p: ReceivedPermission) =>
      (p.delay ?? 0) + sum((p.via ?? []).map((v) => v.delay ?? 0))

    const grouped = chain(contractOrEoa.receivedPermissions ?? [])
      .filter((p) => p.permission === 'upgrade')
      .groupBy((p) => p.from)
      .mapValues((permissions) => ({
        from: permissions[0].from,
        permissionsByDelay: groupBy(permissions, (p) => totalViaDelay(p)),
      }))
      .values()
      .groupBy((permission) =>
        Object.keys(permission.permissionsByDelay).sort().join('►'),
      )
      .value()
    console.dir(grouped, { depth: null })

    const formatVia = (via: ResolvedPermissionPath[]) =>
      `- acting via ${via.map((p) => this.projectDiscovery.formatViaPath(p)).join(', ')}`
    // TODO: don't forget to show p.delay in addition to p.via

    const verbatim = Object.entries(grouped)
      .map(([delays, permissionsByDelay]) =>
        [
          '* Can upgrade with' + delays,
          ...Object.values(permissionsByDelay).map(
            (p) =>
              '  * ' +
              this.projectDiscovery.getContract(p.from).name +
              Object.values(p.permissionsByDelay)
                .map((permissions) =>
                  permissions.map((p) => formatVia(p.via ?? [])).join(' - or - '),
                )
                .join('\n'),
          ),
        ].join('\n'),
      )
      .join('\n')
    console.log(verbatim)

    // return grouped.map((group) => `${[
    //   formatPermissionDescription(description),
    //   formatPermissionCondition(condition),
    //   delay === '' ? '' : formatPermissionDelay(Number(delay)),
    // ]
    //   .filter((s) => s !== '')
    //   .join(' ')
    //   .trim()}.`
    return [
      ...(includeDirectPermissions
        ? this.describeDirectlyReceivedPermissions(contractOrEoa)
        : []),
      ...this.describeUltimatelyReceivedPermissions(contractOrEoa),
    ].filter(notUndefined)
  }

  describeDirectlyReceivedPermissions(
    contractOrEoa: EntryParameters,
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
    contractOrEoa: EntryParameters,
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
}
