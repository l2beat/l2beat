import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { PermissionConfiguration } from '../config/StructureConfig'
import type { ResolvedPermission } from './resolvePermissions'
import { transformToReceived } from './transform'

describe(transformToReceived.name, () => {
  it('correctly transforms resolved and direct permissions', () => {
    const toAddress = EthereumAddress(
      '0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49',
    )
    const resolved: ResolvedPermission[] = [
      {
        path: [
          {
            address: EthereumAddress(
              '0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef',
            ),
            delay: 112233,
            gives: 'interact',
          },
          {
            address: EthereumAddress(
              '0x9E6204F750cD866b299594e2aC9eA824E2e5f95c',
            ),
            delay: 0,
            gives: 'act',
          },
          {
            address: EthereumAddress(
              '0xC72aE5c7cc9a332699305E29F68Be66c73b60542',
            ),
            gives: 'act',
            delay: 5566,
          },
          {
            address: EthereumAddress(
              '0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49',
            ),
            delay: 0,
            gives: undefined,
          },
        ],
      },
      {
        path: [
          {
            address: EthereumAddress(
              '0x1a0ad011913A150f69f6A19DF447A0CfD9551054',
            ),
            delay: 0,
            gives: 'upgrade',
          },
          {
            address: EthereumAddress(
              '0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49',
            ),
            delay: 0,
            gives: undefined,
          },
        ],
      },
    ]
    const metaPermissions: PermissionConfiguration[] = [
      {
        type: 'upgrade',
        target: EthereumAddress('0x3e2Ea9B92B7E48A52296fD261dc26fd995284631'),
        delay: 0,
      },
      {
        type: 'interact',
        delay: 112233,
        target: EthereumAddress('0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef'),
      },
    ]

    const { receivedPermissions } = transformToReceived(
      toAddress,
      resolved,
      metaPermissions,
    )

    expect(receivedPermissions).toEqual([
      {
        permission: 'interact',
        from: EthereumAddress('0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef'),
        delay: 112233,
        description: undefined,
        condition: undefined,
        via: [
          {
            address: EthereumAddress(
              '0x9E6204F750cD866b299594e2aC9eA824E2e5f95c',
            ),
            delay: undefined,
            condition: undefined,
          },
          {
            address: EthereumAddress(
              '0xC72aE5c7cc9a332699305E29F68Be66c73b60542',
            ),
            delay: 5566,
            condition: undefined,
          },
        ],
      },
      {
        permission: 'upgrade',
        from: EthereumAddress('0x1a0ad011913A150f69f6A19DF447A0CfD9551054'),
        delay: undefined,
        description: undefined,
        condition: undefined,
        via: undefined,
      },
    ])
  })
})
