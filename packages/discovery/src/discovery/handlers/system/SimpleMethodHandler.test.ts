import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { SimpleMethodHandler } from './SimpleMethodHandler'

describe(SimpleMethodHandler.name, () => {
  const BLOCK_NUMBER = 1234

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
