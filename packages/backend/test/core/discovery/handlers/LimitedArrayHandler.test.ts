import { mock } from '@l2beat/common'
import { Bytes, EthereumAddress } from '@l2beat/types'
import { expect } from 'earljs'

import { LimitedArrayHandler } from '../../../../src/core/discovery/handlers/LimitedArrayHandler'
import { DiscoveryProvider } from '../../../../src/core/discovery/provider/DiscoveryProvider'

describe(LimitedArrayHandler.name, () => {
  const method = 'function owners(uint256 index) view returns (address)'
  const signature = '0x025e7c27'

  it('calls the passed method n times', async () => {
    const address = EthereumAddress.random()
    const owners = [
      EthereumAddress.random(),
      EthereumAddress.random(),
      EthereumAddress.random(),
    ]

    const provider = mock<DiscoveryProvider>({
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

    const handler = new LimitedArrayHandler(method, 3)
    expect(handler.field).toEqual('owners')

    const result = await handler.execute(provider, address)
    expect(result as unknown).toEqual({
      field: 'owners',
      value: owners,
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

    const provider = mock<DiscoveryProvider>({
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

    const handler = new LimitedArrayHandler(method, 3)
    const result = await handler.execute(provider, address)
    expect(result as unknown).toEqual({
      field: 'owners',
      value: owners.slice(0, 2),
    })
  })

  it('handles other errors', async () => {
    const address = EthereumAddress.random()
    const owners = [
      EthereumAddress.random(),
      EthereumAddress.random(),
      EthereumAddress.random(),
    ]

    const provider = mock<DiscoveryProvider>({
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

    const handler = new LimitedArrayHandler(method, 3)
    const result = await handler.execute(provider, address)
    expect(result as unknown).toEqual({
      field: 'owners',
      error: 'foo bar',
    })
  })
})
