import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { IProvider } from '../provider/IProvider'
import { MANUAL_DETECTORS, ProxyDetector } from './ProxyDetector'
import type { ProxyDetails } from './types'

describe(ProxyDetector.name, () => {
  const address = ChainSpecificAddress.random()
  const implementation = ChainSpecificAddress.random()
  const provider = mockObject<IProvider>({
    getBytecode: vi.fn().mockReturnValue(Bytes.fromHex('0xdeadbeeff4')),
    getDeployment: vi.fn().mockReturnValue(undefined),
  })

  const FIRST_DETAILS: ProxyDetails = {
    type: 'EIP1967 proxy',
    values: {
      $admin: ChainSpecificAddress.random().toString(),
      $implementation: implementation,
    },
  }

  const SECOND_DETAILS: ProxyDetails = {
    type: 'EIP1967 proxy',
    values: {
      $admin: ChainSpecificAddress.random().toString(),
      $implementation: implementation,
    },
  }

  it('detects eoa when no code', async () => {
    const detector = new ProxyDetector(
      [async () => undefined, async () => undefined],
      [],
    )

    const provider = mockObject<IProvider>({
      getBytecode: vi.fn().mockReturnValue(Bytes.EMPTY),
      getDeployment: vi.fn().mockReturnValue(undefined),
    })
    const result = await detector.detectProxy(provider, address)

    expect(result).toStrictEqual({
      type: 'EOA',
      deployment: undefined,
      values: {},
      addresses: [],
    })
  })

  it('detects EIP7702 eoa', async () => {
    const detector = new ProxyDetector(
      [async () => undefined, async () => undefined],
      [],
    )

    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      getBytecode: vi
        .fn()
        .mockReturnValue(
          Bytes.fromHex('0xef0100').concat(
            Bytes.fromHex(
              ChainSpecificAddress.address(implementation).toString(),
            ),
          ),
        ),
      getDeployment: vi.fn().mockReturnValue(undefined),
    })
    const result = await detector.detectProxy(provider, address)

    expect(result).toStrictEqual({
      type: 'EIP7702 EOA',
      deployment: undefined,
      values: {
        $implementation: implementation,
      },
      addresses: [implementation],
    })
  })

  it('detects no proxy as immutable', async () => {
    const detector = new ProxyDetector(
      [async () => undefined, async () => undefined],
      [],
    )
    const result = await detector.detectProxy(provider, address)

    expect(result).toStrictEqual({
      type: 'immutable',
      deployment: undefined,
      values: { $immutable: true },
      addresses: [address],
    })
  })

  it('detects the first proxy', async () => {
    const detector = new ProxyDetector(
      [async () => undefined, async () => FIRST_DETAILS],
      [async () => undefined, async () => SECOND_DETAILS],
    )

    const result = await detector.detectProxy(provider, address)

    expect(result).toStrictEqual({
      ...FIRST_DETAILS,
      deployment: undefined,
      addresses: [address, implementation],
    })
  })

  it('detects a manual proxy', async () => {
    const detector = new ProxyDetector([], [], {
      ...MANUAL_DETECTORS,
      'call implementation proxy': async () => FIRST_DETAILS,
    })
    const result = await detector.detectProxy(
      provider,
      address,
      'call implementation proxy',
    )

    expect(result).toStrictEqual({
      ...FIRST_DETAILS,
      deployment: undefined,
      addresses: [address, implementation],
    })
  })
})
