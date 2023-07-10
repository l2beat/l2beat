import {
  EthereumAddress,
  ManualProxyType,
  ProxyDetails,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { DiscoveryLogger } from '../DiscoveryLogger'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { Detector, ProxyDetector } from './ProxyDetector'

describe(ProxyDetector.name, () => {
  const BLOCK_NUMBER = 1234

  const FIRST_DETAILS: ProxyDetails = {
    upgradeability: {
      type: 'EIP1967 proxy',
      admin: EthereumAddress.random(),
      implementation: EthereumAddress.random(),
    },
    implementations: [],
    relatives: [],
  }

  const SECOND_DETAILS: ProxyDetails = {
    upgradeability: {
      type: 'EIP1967 proxy',
      admin: EthereumAddress.random(),
      implementation: EthereumAddress.random(),
    },
    implementations: [],
    relatives: [],
  }

  it('can detect no proxy', async () => {
    const provider = mockObject<DiscoveryProvider>()

    const detector = new ProxyDetector(provider, DiscoveryLogger.SILENT, [
      async () => undefined,
      async () => undefined,
    ])
    const result = await detector.detectProxy(
      EthereumAddress.random(),
      BLOCK_NUMBER,
    )

    expect(result).toEqual(undefined)
  })

  it('detects the first proxy', async () => {
    const provider = mockObject<DiscoveryProvider>()

    const detector = new ProxyDetector(provider, DiscoveryLogger.SILENT, [
      async () => undefined,
      async () => FIRST_DETAILS,
      async () => undefined,
      async () => SECOND_DETAILS,
    ])
    const result = await detector.detectProxy(
      EthereumAddress.random(),
      BLOCK_NUMBER,
    )

    expect(result).toEqual(FIRST_DETAILS)
  })

  it('detects a manual proxy', async () => {
    const provider = mockObject<DiscoveryProvider>()

    const detector = new ProxyDetector(provider, DiscoveryLogger.SILENT, [], {
      'call implementation proxy': async () => FIRST_DETAILS,
      'new Arbitrum proxy': async () => SECOND_DETAILS,
      'zkSync Lite proxy': async () => undefined,
      'zkSpace proxy': async () => undefined,
      'Eternal Storage proxy': async () => undefined,
      'Polygon Extension proxy': async () => undefined,
    } as Record<ManualProxyType, Detector>)
    const result = await detector.detectProxy(
      EthereumAddress.random(),
      BLOCK_NUMBER,
      'call implementation proxy',
    )

    expect(result).toEqual(FIRST_DETAILS)
  })
})
