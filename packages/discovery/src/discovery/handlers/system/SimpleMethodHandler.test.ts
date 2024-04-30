import { expect, mockObject } from 'earl'

import { Bytes } from '../../../utils/Bytes'
import { EthereumAddress } from '../../../utils/EthereumAddress'
import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { MulticallClient } from '../../provider/multicall/MulticallClient'
import { SimpleMethodHandler } from './SimpleMethodHandler'

describe(SimpleMethodHandler.name, () => {
  const BLOCK_NUMBER = 1234

  describe(SimpleMethodHandler.prototype.execute.name, () => {
    it('can correctly call balanceOf', async () => {
      const address = EthereumAddress.random()
      const provider = mockObject<DiscoveryProvider>({
        async call(passedAddress, data) {
          expect(passedAddress).toEqual(address)
          expect(data).toEqual(Bytes.fromHex('0x722713f7'))
          return Bytes.fromHex(
            '0x0000000000000000000000000000000000000000000000000000000000000123',
          )
        },
      })

      const handler = new SimpleMethodHandler(
        'function balanceOf() view returns (uint256)',
        DiscoveryLogger.SILENT,
      )
      expect(handler.field).toEqual('balanceOf')

      const result = await handler.execute(provider, address, BLOCK_NUMBER)
      expect(result).toEqual({
        field: 'balanceOf',
        value: 0x123,
      })
    })

    it('handles a revert', async () => {
      const handler = new SimpleMethodHandler(
        'function balanceOf() view returns (uint256)',
        DiscoveryLogger.SILENT,
      )

      const provider = mockObject<DiscoveryProvider>({
        async call() {
          throw new Error('Error during execution: revert')
        },
      })
      const address = EthereumAddress.random()
      const result = await handler.execute(provider, address, BLOCK_NUMBER)
      expect(result).toEqual({
        field: 'balanceOf',
        error: 'Execution reverted',
      })
    })

    it('handles any other error', async () => {
      const handler = new SimpleMethodHandler(
        'function balanceOf() view returns (uint256)',
        DiscoveryLogger.SILENT,
      )

      const provider = mockObject<DiscoveryProvider>({
        async call() {
          throw new Error('foo bar')
        },
      })
      const address = EthereumAddress.random()
      const result = await handler.execute(provider, address, BLOCK_NUMBER)
      expect(result).toEqual({
        field: 'balanceOf',
        error: 'foo bar',
      })
    })
  })

  describe('multicallable', () => {
    it('can correctly call balanceOf', async () => {
      const address = EthereumAddress.random()
      const multicall = mockObject<MulticallClient>({
        async multicall() {
          return [
            {
              success: true,
              data: Bytes.fromHex(
                '0x0000000000000000000000000000000000000000000000000000000000000123',
              ),
            },
          ]
        },
      })

      const handler = new SimpleMethodHandler(
        'function balanceOf() view returns (uint256)',
        DiscoveryLogger.SILENT,
      )
      expect(handler.field).toEqual('balanceOf')
      const encoded = handler.encode(address)
      expect(encoded).toEqual([
        {
          address,
          data: Bytes.fromHex('0x722713f7'),
        },
      ])
      const response = await multicall.multicall(encoded, BLOCK_NUMBER)
      const result = handler.decode(response)
      expect(result).toEqual({
        field: 'balanceOf',
        value: 0x123,
      })
    })

    it('handles an error', async () => {
      const handler = new SimpleMethodHandler(
        'function balanceOf() view returns (uint256)',
        DiscoveryLogger.SILENT,
      )
      const multicall = mockObject<MulticallClient>({
        async multicall() {
          return [
            {
              success: false,
              data: Bytes.EMPTY,
            },
          ]
        },
      })
      const address = EthereumAddress.random()
      const encoded = handler.encode(address)
      const response = await multicall.multicall(encoded, BLOCK_NUMBER)
      const result = handler.decode(response)
      expect(result).toEqual({
        field: 'balanceOf',
        error: 'Multicall failed',
      })
    })

    it('can correctly decode a tuple', async () => {
      const response =
        '0x0000000000000000000000000000000000000000000000000000000001312d00000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000003b9aca0000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000ffffffffffffffffffffffffffffffff'
      const abi =
        'function resourceConfig() view returns (tuple(uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))'

      const handler = new SimpleMethodHandler(abi, DiscoveryLogger.SILENT)

      const decoded = handler.decode([
        {
          success: true,
          data: Bytes.fromHex(response),
        },
      ])

      expect(decoded).toEqual({
        field: 'resourceConfig',
        value: [
          20000000,
          10,
          8,
          1000000000,
          1000000,
          '340282366920938463463374607431768211455',
        ],
      })
    })
  })
})
