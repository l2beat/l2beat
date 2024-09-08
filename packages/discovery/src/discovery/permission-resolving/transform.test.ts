import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { PermissionConfiguration } from '../config/RawDiscoveryConfig'
import { ResolvedPermission } from './resolvePermissions'
import { transformToReceived } from './transform'

describe(transformToReceived.name, () => {
  it('correctly transforms resolved and direct permissions', () => {
    const toAddress = EthereumAddress(
      '0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49',
    )
    const resolved: ResolvedPermission[] = [
      {
        permission: 'configure',
        path: [
          {
            address: EthereumAddress(
              '0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef',
            ),
            delay: 112233,
          },
          {
            address: EthereumAddress(
              '0x9E6204F750cD866b299594e2aC9eA824E2e5f95c',
            ),
            delay: 0,
          },
          {
            address: EthereumAddress(
              '0xC72aE5c7cc9a332699305E29F68Be66c73b60542',
            ),
            delay: 5566,
          },
          {
            address: EthereumAddress(
              '0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49',
            ),
            delay: 0,
          },
        ],
      },
      {
        permission: 'upgrade',
        path: [
          {
            address: EthereumAddress(
              '0x1a0ad011913A150f69f6A19DF447A0CfD9551054',
            ),
            delay: 0,
          },
          {
            address: EthereumAddress(
              '0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49',
            ),
            delay: 0,
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
        type: 'configure',
        delay: 112233,
        target: EthereumAddress('0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef'),
      },
    ]

    const { directlyReceivedPermissions, receivedPermissions } =
      transformToReceived(toAddress, resolved, metaPermissions)

    expect(directlyReceivedPermissions).toEqual([
      {
        description: undefined,
        permission: 'configure',
        target: EthereumAddress('0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef'),
        delay: 112233,
        via: undefined,
      },
      {
        description: undefined,
        permission: 'upgrade',
        target: EthereumAddress('0x3e2Ea9B92B7E48A52296fD261dc26fd995284631'),
        delay: undefined,
        via: undefined,
      },
    ])

    expect(receivedPermissions).toEqual([
      {
        permission: 'configure',
        target: EthereumAddress('0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef'),
        delay: 112233,
        description: undefined,
        via: [
          {
            address: EthereumAddress(
              '0x9E6204F750cD866b299594e2aC9eA824E2e5f95c',
            ),
            delay: undefined,
          },
          {
            address: EthereumAddress(
              '0xC72aE5c7cc9a332699305E29F68Be66c73b60542',
            ),
            delay: 5566,
          },
        ],
      },
      {
        permission: 'upgrade',
        target: EthereumAddress('0x1a0ad011913A150f69f6A19DF447A0CfD9551054'),
        delay: undefined,
        description: undefined,
        via: undefined,
      },
    ])
  })

  it('correctly ignores directPermission if it is already in received (ultimate)', () => {
    const toAddress = EthereumAddress(
      '0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49',
    )
    const resolved: ResolvedPermission[] = [
      {
        permission: 'configure',
        path: [
          {
            address: EthereumAddress(
              '0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef',
            ),
            delay: 0,
          },
          {
            address: EthereumAddress(
              '0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49',
            ),
            delay: 0,
          },
        ],
      },
      {
        permission: 'upgrade',
        path: [
          {
            address: EthereumAddress(
              '0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef',
            ),
            delay: 0,
          },
          {
            address: EthereumAddress(
              '0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49',
            ),
            delay: 0,
          },
        ],
      },
      {
        permission: 'configure',
        path: [
          {
            address: EthereumAddress(
              '0xC72aE5c7cc9a332699305E29F68Be66c73b60542',
            ),
            delay: 0,
          },
          {
            address: EthereumAddress(
              '0x9E6204F750cD866b299594e2aC9eA824E2e5f95c',
            ),
            delay: 0,
          },
          {
            address: EthereumAddress(
              '0xD4ef175B9e72cAEe9f1fe7660a6Ec19009903b49',
            ),
            delay: 0,
          },
        ],
      },
    ]
    const metaPermissions: PermissionConfiguration[] = [
      {
        // this one is in ignored but with different delay, so should not be skipped
        type: 'upgrade',
        target: EthereumAddress('0x3e2Ea9B92B7E48A52296fD261dc26fd995284631'),
        delay: 8899,
      },
      {
        // this one is already in received so should be ignored
        type: 'configure',
        delay: 0,
        target: EthereumAddress('0xEF8115F2733fb2033a7c756402Fc1deaa56550Ef'),
      },
      {
        // this one is already in received but with via, so should not be ignored
        type: 'configure',
        delay: 0,
        target: EthereumAddress('0xC72aE5c7cc9a332699305E29F68Be66c73b60542'),
      },
    ]

    const { directlyReceivedPermissions } = transformToReceived(
      toAddress,
      resolved,
      metaPermissions,
    )

    expect(directlyReceivedPermissions).toEqual([
      {
        delay: undefined,
        description: undefined,
        permission: 'configure',
        target: EthereumAddress('0xC72aE5c7cc9a332699305E29F68Be66c73b60542'),
        via: undefined,
      },
      {
        delay: 8899,
        description: undefined,
        permission: 'upgrade',
        target: EthereumAddress('0x3e2Ea9B92B7E48A52296fD261dc26fd995284631'),
        via: undefined,
      },
    ])
  })
})
