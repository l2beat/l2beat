import { Bytes, ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import { ArbitrumDACKeysetHandler } from './ArbitrumDACKeysetHandler'

describe(ArbitrumDACKeysetHandler.name, () => {
  const abi = new utils.Interface([
    'event SetValidKeyset(bytes32 indexed keysetHash, bytes keysetBytes)',
  ])

  const emptyKeyBytes = Bytes.fromHex('0x0001aa')
  function generateEmptyKeyBytes(keyCount: number): Bytes {
    let result = Bytes.EMPTY

    for (let i = 0; i < keyCount; i++) {
      result = result.concat(emptyKeyBytes)
    }

    return result
  }

  function SetValidKeyset(threshold: number, keyCount: number): providers.Log {
    const keysetHash = Hash256.random()
    const keysetBytes = Bytes.fromByteArray([])
      .concat(Bytes.fromHex(`0x${threshold.toString(16).padStart(16, '0')}`))
      .concat(Bytes.fromHex(`0x${keyCount.toString(16).padStart(16, '0')}`))
      .concat(generateEmptyKeyBytes(keyCount))

    return abi.encodeEventLog(abi.getEvent('SetValidKeyset'), [
      keysetHash.toString(),
      keysetBytes.toString(),
    ]) as providers.Log
  }

  it('fetches last event and decodes the values correctly', async () => {
    const address = ChainSpecificAddress.random()
    const provider = mockObject<IProvider>({
      async getLogs(providedAddress, topics) {
        expect(providedAddress).toEqual(address)
        expect(topics).toEqual([[abi.getEventTopic('SetValidKeyset')]])
        return [
          SetValidKeyset(1, 2),
          SetValidKeyset(2, 3),
          SetValidKeyset(4, 4),
          SetValidKeyset(2, 6),
          SetValidKeyset(4, 7),
        ]
      },
    })

    const handler = new ArbitrumDACKeysetHandler('someName', {
      type: 'arbitrumDACKeyset',
    })

    const value = await handler.execute(provider, address)
    expect(value).toEqual({
      field: 'someName',
      value: {
        blsSignatures: ['qg==', 'qg==', 'qg==', 'qg==', 'qg==', 'qg==', 'qg=='],
        requiredSignatures: 4,
        membersCount: 7,
      },
    })
  })

  it('returns zero for no events found', async () => {
    const address = ChainSpecificAddress.random()
    const provider = mockObject<IProvider>({
      async getLogs(providedAddress, topics) {
        expect(providedAddress).toEqual(address)
        expect(topics).toEqual([[abi.getEventTopic('SetValidKeyset')]])
        return []
      },
    })

    const handler = new ArbitrumDACKeysetHandler('someName', {
      type: 'arbitrumDACKeyset',
    })

    const value = await handler.execute(provider, address)
    expect(value).toEqual({
      field: 'someName',
      value: {
        blsSignatures: [],
        requiredSignatures: 0,
        membersCount: 0,
      },
    })
  })
})
