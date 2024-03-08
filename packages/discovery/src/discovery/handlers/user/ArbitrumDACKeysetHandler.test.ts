import { expect, mockObject } from 'earl'
import { providers, utils } from 'ethers'

import { Bytes } from '../../../utils/Bytes'
import { EthereumAddress } from '../../../utils/EthereumAddress'
import { Hash256 } from '../../../utils/Hash256'
import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { ArbitrumDACKeysetHandler } from './ArbitrumDACKeysetHandler'

describe(ArbitrumDACKeysetHandler.name, () => {
  const BLOCK_NUMBER = 1234
  const abi = new utils.Interface([
    'event SetValidKeyset(bytes32 indexed keysetHash, bytes keysetBytes)',
  ])

  function SetValidKeyset(threshold: number, keyCount: number): providers.Log {
    const keysetHash = Hash256.random()
    const keysetBytes = Bytes.fromByteArray([])
      .concat(Bytes.fromHex(`0x${threshold.toString(16).padStart(16, '0')}`))
      .concat(Bytes.fromHex(`0x${keyCount.toString(16).padStart(16, '0')}`))
      .concat(Bytes.randomOfLength(256))

    return abi.encodeEventLog(abi.getEvent('SetValidKeyset'), [
      keysetHash.toString(),
      keysetBytes.toString(),
    ]) as providers.Log
  }

  it('fetches last event and decodes the values correctly', async () => {
    const address = EthereumAddress.random()
    const provider = mockObject<DiscoveryProvider>({
      async getLogs(providedAddress, topics, fromBlock, toBlock) {
        expect(providedAddress).toEqual(address)
        expect(topics).toEqual([[abi.getEventTopic('SetValidKeyset')]])
        expect(fromBlock).toEqual(0)
        expect(toBlock).toEqual(BLOCK_NUMBER)
        return [
          SetValidKeyset(1, 2),
          SetValidKeyset(2, 3),
          SetValidKeyset(4, 4),
          SetValidKeyset(2, 6),
          SetValidKeyset(4, 7),
        ]
      },
    })

    const handler = new ArbitrumDACKeysetHandler(
      'someName',
      { type: 'arbitrumDACKeyset' },
      DiscoveryLogger.SILENT,
    )

    const value = await handler.execute(provider, address, BLOCK_NUMBER)
    expect(value).toEqual({
      field: 'someName',
      value: {
        requiredSignatures: 4,
        membersCount: 7,
      },
    })
  })

  it('returns zero for no events found', async () => {
    const address = EthereumAddress.random()
    const provider = mockObject<DiscoveryProvider>({
      async getLogs(providedAddress, topics, fromBlock, toBlock) {
        expect(providedAddress).toEqual(address)
        expect(topics).toEqual([[abi.getEventTopic('SetValidKeyset')]])
        expect(fromBlock).toEqual(0)
        expect(toBlock).toEqual(BLOCK_NUMBER)
        return []
      },
    })

    const handler = new ArbitrumDACKeysetHandler(
      'someName',
      { type: 'arbitrumDACKeyset' },
      DiscoveryLogger.SILENT,
    )

    const value = await handler.execute(provider, address, BLOCK_NUMBER)
    expect(value).toEqual({
      field: 'someName',
      value: {
        requiredSignatures: 0,
        membersCount: 0,
      },
    })
  })
})
