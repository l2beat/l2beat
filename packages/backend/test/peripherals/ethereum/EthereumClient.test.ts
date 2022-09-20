import { mock } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'
import { expect, mockFn } from 'earljs'
import { providers } from 'ethers'

import { EthereumClient } from '../../../src/peripherals/ethereum/EthereumClient'

describe(EthereumClient.name, () => {
  describe(EthereumClient.prototype.getAllLogs.name, () => {
    it('divides on two calls', async () => {
      const provider = mock<providers.Provider>({
        getLogs: mockFn()
          .throwsOnce(new Error('Log response size exceeded'))
          .returnsOnce([])
          .returnsOnce([]),
      })

      const ethereumClient = new EthereumClient(provider)

      const address = EthereumAddress.random()
      const topic = 'aaaa'
      await ethereumClient.getAllLogs(address, topic, 1000, 2000)

      expect(provider.getLogs).toHaveBeenCalledExactlyWith([
        [
          {
            address: address.toString(),
            topics: [topic],
            fromBlock: 1000,
            toBlock: 2000,
          },
        ],
        [
          {
            address: address.toString(),
            topics: [topic],
            fromBlock: 1000,
            toBlock: 1500,
          },
        ],
        [
          {
            address: address.toString(),
            topics: [topic],
            fromBlock: 1501,
            toBlock: 2000,
          },
        ],
      ])
    })

    it('correctly divides range of two', async () => {
      const provider = mock<providers.Provider>({
        getLogs: mockFn()
          .throwsOnce(new Error('Log response size exceeded'))
          .returnsOnce([])
          .returnsOnce([]),
      })

      const ethereumClient = new EthereumClient(provider)

      const address = EthereumAddress.random()
      const topic = 'aaaa'
      await ethereumClient.getAllLogs(address, topic, 1, 2)

      expect(provider.getLogs).toHaveBeenCalledExactlyWith([
        [
          {
            address: address.toString(),
            topics: [topic],
            fromBlock: 1,
            toBlock: 2,
          },
        ],
        [
          {
            address: address.toString(),
            topics: [topic],
            fromBlock: 1,
            toBlock: 1,
          },
        ],
        [
          {
            address: address.toString(),
            topics: [topic],
            fromBlock: 2,
            toBlock: 2,
          },
        ],
      ])
    })

    it('fromBlock === toBlock', async () => {
      const provider = mock<providers.Provider>({
        getLogs: mockFn().throwsOnce(new Error('Log response size exceeded')),
      })

      const ethereumClient = new EthereumClient(provider)

      const address = EthereumAddress.random()
      const topic = 'aaaa'

      await expect(
        ethereumClient.getAllLogs(address, topic, 1, 1),
      ).toBeRejected()

      expect(provider.getLogs).toHaveBeenCalledExactlyWith([
        [
          {
            address: address.toString(),
            topics: [topic],
            fromBlock: 1,
            toBlock: 1,
          },
        ],
      ])
    })
  })
})
