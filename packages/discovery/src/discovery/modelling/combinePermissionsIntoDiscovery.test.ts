import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { DiscoveryOutput, PermissionsOutput } from '../output/types'
import { combinePermissionsIntoDiscovery } from './combinePermissionsIntoDiscovery'

describe(combinePermissionsIntoDiscovery.name, () => {
  it('stores project-scoped permissions for actors from referenced discoveries', () => {
    const target = ChainSpecificAddress(
      'eth:0x1111111111111111111111111111111111111111',
    )
    const proxy = ChainSpecificAddress(
      'eth:0x2222222222222222222222222222222222222222',
    )
    const externalActor = ChainSpecificAddress(
      'eth:0x3333333333333333333333333333333333333333',
    )
    const discovery: DiscoveryOutput = {
      name: 'project',
      timestamp: 1,
      entries: [
        { type: 'Contract', address: target, name: 'Target' },
        {
          type: 'Reference',
          address: proxy,
          name: 'Proxy',
          targetProject: 'dependency',
        },
      ],
      abis: {},
      configHash: Hash256.random(),
      usedTemplates: {},
      usedBlockNumbers: {},
    }
    const permissionsOutput: PermissionsOutput = {
      permissionsConfigHash: Hash256.random(),
      dependentTimestamps: {
        project: { timestamp: 1 },
        dependency: { timestamp: 2 },
      },
      permissions: [
        {
          receiver: proxy,
          permission: 'interact',
          from: target,
          isFinal: false,
          description: 'Impact on the project.',
        },
        {
          receiver: externalActor,
          permission: 'interact',
          from: target,
          isFinal: true,
          description: 'Impact on the project.',
          via: [
            {
              address: proxy,
              permission: 'act',
              description: 'Reconfigure the proxy.',
              role: '.owner',
            },
          ],
        },
      ],
    }

    combinePermissionsIntoDiscovery(discovery, permissionsOutput)

    expect(discovery.externalPermissions).toEqual({
      [externalActor]: {
        receivedPermissions: [
          {
            permission: 'interact',
            from: target,
            description: 'Impact on the project.',
            via: [
              {
                address: proxy,
                permission: 'act',
                description: 'Reconfigure the proxy.',
                role: '.owner',
              },
            ],
          },
        ],
        directlyReceivedPermissions: undefined,
        eoaWithUpgradePermissions: undefined,
      },
      [proxy]: {
        receivedPermissions: undefined,
        directlyReceivedPermissions: [
          {
            permission: 'interact',
            from: target,
            description: 'Impact on the project.',
          },
        ],
        eoaWithUpgradePermissions: undefined,
      },
    })
    expect(discovery.dependentDiscoveries).toEqual({
      dependency: { timestamp: 2 },
    })
  })

  it('stores a referenced project-scoped permission group as one external group', () => {
    const target = ChainSpecificAddress(
      'eth:0x1111111111111111111111111111111111111111',
    )
    const externalTarget = ChainSpecificAddress(
      'eth:0x2222222222222222222222222222222222222222',
    )
    const memberA = ChainSpecificAddress(
      'eth:0x3333333333333333333333333333333333333333',
    )
    const memberB = ChainSpecificAddress(
      'eth:0x4444444444444444444444444444444444444444',
    )
    const discovery: DiscoveryOutput = {
      name: 'project',
      timestamp: 1,
      entries: [
        { type: 'Contract', address: target, name: 'Target' },
        {
          type: 'Reference',
          address: externalTarget,
          name: 'ExternalTarget',
          targetProject: 'dependency',
        },
      ],
      abis: {},
      configHash: Hash256.random(),
      usedTemplates: {},
      usedBlockNumbers: {},
    }
    const permissionsOutput: PermissionsOutput = {
      permissionsConfigHash: Hash256.random(),
      dependentTimestamps: {
        project: { timestamp: 1 },
        dependency: { timestamp: 2 },
      },
      permissions: [],
      permissionGroups: [
        {
          id: 'relay',
          name: 'Transmitters',
          memberName: 'Transmitter',
          threshold: 1,
          members: [memberA, memberB],
          permission: {
            permission: 'interact',
            from: externalTarget,
            description: 'relay reports authorized by the signer quorum.',
          },
          isProjectScoped: true,
        },
      ],
    }

    combinePermissionsIntoDiscovery(discovery, permissionsOutput)

    expect(discovery.externalPermissionGroups).toEqual([
      {
        id: 'relay',
        name: 'Transmitters',
        memberName: 'Transmitter',
        threshold: 1,
        members: [memberA, memberB],
        permission: {
          permission: 'interact',
          from: externalTarget,
          description: 'relay reports authorized by the signer quorum.',
        },
      },
    ])
    expect(discovery.permissionGroups).toEqual(undefined)
    expect(discovery.externalPermissions).toEqual(undefined)
  })
})
