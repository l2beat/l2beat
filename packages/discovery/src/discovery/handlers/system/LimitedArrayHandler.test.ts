import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { LimitedArrayHandler } from './LimitedArrayHandler'

describe(LimitedArrayHandler.name, () => {
  const BLOCK_NUMBER = 1234
  const method = 'function owners(uint256 index) view returns (address)'
  const signature = '0x025e7c27'

  it('calls the passed method n times', async () => {
    const address = EthereumAddress.random()
    const owners = [
      EthereumAddress.random(),
      EthereumAddress.random(),
      EthereumAddress.random(),
    ]

    const provider = mockObject<DiscoveryProvider>({
      async call(passedAddress, data) {
        expect(passedAddress).toEqual(address)

        const index = data.get(35)

        expect(data).toEqual(
          Bytes.fromHex(signature + index.toString().padStart(64, '0')),
        )

        return Bytes.fromHex('00'.repeat(12)).concat(
          Bytes.fromHex(owners[index].toString()),
        )
      },
    })

    const handler = new LimitedArrayHandler(method, 3, DiscoveryLogger.SILENT)
    expect(handler.field).toEqual('owners')

    const result = await handler.execute(provider, address, BLOCK_NUMBER)
    expect(result).toEqual({
      field: 'owners',
      value: owners.map((x) => x.toString()),
      error: 'Too many values. Update configuration explore fully',
    })
  })

  it('handles a revert', async () => {
    const address = EthereumAddress.random()
    const owners = [
      EthereumAddress.random(),
      EthereumAddress.random(),
      EthereumAddress.random(),
    ]

    const provider = mockObject<DiscoveryProvider>({
      async call(_, data) {
        const index = data.get(35)

        if (index === 2) {
          throw new Error('Error during execution: revert')
        }

        return Bytes.fromHex('00'.repeat(12)).concat(
          Bytes.fromHex(owners[index].toString()),
        )
      },
    })

    const handler = new LimitedArrayHandler(method, 3, DiscoveryLogger.SILENT)
    const result = await handler.execute(provider, address, BLOCK_NUMBER)
    expect(result).toEqual({
      field: 'owners',
      value: owners.map((x) => x.toString()).slice(0, 2),
    })
  })

  it('handles other errors', async () => {
    const address = EthereumAddress.random()
    const owners = [
      EthereumAddress.random(),
      EthereumAddress.random(),
      EthereumAddress.random(),
    ]

    const provider = mockObject<DiscoveryProvider>({
      async call(_, data) {
        const index = data.get(35)

        if (index === 2) {
          throw new Error('foo bar')
        }

        return Bytes.fromHex('00'.repeat(12)).concat(
          Bytes.fromHex(owners[index].toString()),
        )
      },
    })

    const handler = new LimitedArrayHandler(method, 3, DiscoveryLogger.SILENT)
    const result = await handler.execute(provider, address, BLOCK_NUMBER)
    expect(result).toEqual({
      field: 'owners',
      error: 'foo bar',
    })
  })
})
