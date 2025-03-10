import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { IProvider } from '../provider/IProvider'
import { MANUAL_DETECTORS, ProxyDetector } from './ProxyDetector'
import type { ProxyDetails } from './types'

describe(ProxyDetector.name, () => {
  const address = EthereumAddress.random()
  const implementation = EthereumAddress.random()
  const provider = mockObject<IProvider>({
    getBytecode: mockFn().returns(Bytes.fromHex('0xdeadbeef')),
    getDeployment: mockFn().returns(undefined),
  })

  const FIRST_DETAILS: ProxyDetails = {
    type: 'EIP1967 proxy',
    values: {
      $admin: EthereumAddress.random().toString(),
      $implementation: implementation,
    },
  }

  const SECOND_DETAILS: ProxyDetails = {
    type: 'EIP1967 proxy',
    values: {
      $admin: EthereumAddress.random().toString(),
      $implementation: implementation,
    },
  }

  it('detects no proxy as immutable', async () => {
    const detector = new ProxyDetector([
      async () => undefined,
      async () => undefined,
    ])
    const result = await detector.detectProxy(provider, address)

    expect(result).toEqual({
      type: 'immutable',
      deployment: undefined,
      values: { $immutable: true },
      addresses: [address],
    })
  })

  it('detects the first proxy', async () => {
    const detector = new ProxyDetector([
      async () => undefined,
      async () => FIRST_DETAILS,
      async () => undefined,
      async () => SECOND_DETAILS,
    ])

    const result = await detector.detectProxy(provider, address)

    expect(result).toEqual({
      ...FIRST_DETAILS,
      deployment: undefined,
      addresses: [address, implementation],
    })
  })

  it('detects a manual proxy', async () => {
    const detector = new ProxyDetector([], {
      ...MANUAL_DETECTORS,
      'call implementation proxy': async () => FIRST_DETAILS,
    })
    const result = await detector.detectProxy(
      provider,
      address,
      'call implementation proxy',
    )

    expect(result).toEqual({
      ...FIRST_DETAILS,
      deployment: undefined,
      addresses: [address, implementation],
    })
  })
})
