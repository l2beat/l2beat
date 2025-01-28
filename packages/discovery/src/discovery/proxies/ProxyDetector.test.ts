import type { ProxyDetails } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { IProvider } from '../provider/IProvider'
import { MANUAL_DETECTORS, ProxyDetector } from './ProxyDetector'

describe(ProxyDetector.name, () => {
  const FIRST_DETAILS: ProxyDetails = {
    type: 'EIP1967 proxy',
    values: {
      $admin: EthereumAddress.random().toString(),
      $implementation: EthereumAddress.random().toString(),
    },
  }

  const SECOND_DETAILS: ProxyDetails = {
    type: 'EIP1967 proxy',
    values: {
      $admin: EthereumAddress.random().toString(),
      $implementation: EthereumAddress.random().toString(),
    },
  }

  it('can detect no proxy', async () => {
    const provider = mockObject<IProvider>()
    const detector = new ProxyDetector([
      async () => undefined,
      async () => undefined,
    ])
    const result = await detector.detectProxy(
      provider,
      EthereumAddress.random(),
    )

    expect(result).toEqual(undefined)
  })

  it('detects the first proxy', async () => {
    const provider = mockObject<IProvider>()
    const detector = new ProxyDetector([
      async () => undefined,
      async () => FIRST_DETAILS,
      async () => undefined,
      async () => SECOND_DETAILS,
    ])
    const result = await detector.detectProxy(
      provider,
      EthereumAddress.random(),
    )
    expect(result).toEqual(FIRST_DETAILS)
  })

  it('detects a manual proxy', async () => {
    const provider = mockObject<IProvider>()
    const detector = new ProxyDetector([], {
      ...MANUAL_DETECTORS,
      'call implementation proxy': async () => FIRST_DETAILS,
    })
    const result = await detector.detectProxy(
      provider,
      EthereumAddress.random(),
      'call implementation proxy',
    )

    expect(result).toEqual(FIRST_DETAILS)
  })
})
