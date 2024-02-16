import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { providers } from 'ethers'

import { RpcClient } from './RpcClient'

describe(RpcClient.name, () => {
  describe(RpcClient.prototype.getAllLogs.name, () => {
    it('divides on two calls', async () => {
      const provider = mockObject<providers.Provider>({
        call: mockFn(),
        getBlock: mockFn(),
        getBlockNumber: mockFn(),
        getBalance: mockFn(),
        getLogs: mockFn()
          .throwsOnce(new Error('Log response size exceeded'))
          .returnsOnce([])
          .returnsOnce([]),
        getTransaction: mockFn(),
      })

      const ethereumClient = new RpcClient(provider, Logger.SILENT)

      const address = EthereumAddress.random()
      const topic = 'aaaa'
      await ethereumClient.getAllLogs(address, topic, 1000, 2000)

      expect(provider.getLogs).toHaveBeenCalledTimes(3)
      expect(provider.getLogs).toHaveBeenNthCalledWith(1, {
        address: address.toString(),
        topics: [topic],
        fromBlock: 1000,
        toBlock: 2000,
      })
      expect(provider.getLogs).toHaveBeenNthCalledWith(2, {
        address: address.toString(),
        topics: [topic],
        fromBlock: 1000,
        toBlock: 1500,
      })
      expect(provider.getLogs).toHaveBeenNthCalledWith(3, {
        address: address.toString(),
        topics: [topic],
        fromBlock: 1501,
        toBlock: 2000,
      })
    })

    it('correctly divides range of two', async () => {
      const provider = mockObject<providers.Provider>({
        call: mockFn(),
        getBlock: mockFn(),
        getBlockNumber: mockFn(),
        getBalance: mockFn(),
        getLogs: mockFn()
          .throwsOnce(new Error('Log response size exceeded'))
          .returnsOnce([])
          .returnsOnce([]),
        getTransaction: mockFn(),
      })

      const ethereumClient = new RpcClient(provider, Logger.SILENT)

      const address = EthereumAddress.random()
      const topic = 'aaaa'
      await ethereumClient.getAllLogs(address, topic, 1, 2)

      expect(provider.getLogs).toHaveBeenCalledTimes(3)
      expect(provider.getLogs).toHaveBeenNthCalledWith(1, {
        address: address.toString(),
        topics: [topic],
        fromBlock: 1,
        toBlock: 2,
      })
      expect(provider.getLogs).toHaveBeenNthCalledWith(2, {
        address: address.toString(),
        topics: [topic],
        fromBlock: 1,
        toBlock: 1,
      })
      expect(provider.getLogs).toHaveBeenNthCalledWith(3, {
        address: address.toString(),
        topics: [topic],
        fromBlock: 2,
        toBlock: 2,
      })
    })

    it('fromBlock === toBlock', async () => {
      const provider = mockObject<providers.Provider>({
        call: mockFn(),
        getBlock: mockFn(),
        getBlockNumber: mockFn(),
        getBalance: mockFn(),
        getLogs: mockFn().throwsOnce(new Error('Log response size exceeded')),
        getTransaction: mockFn(),
      })

      const ethereumClient = new RpcClient(provider, Logger.SILENT)

      const address = EthereumAddress.random()
      const topic = 'aaaa'

      await expect(
        ethereumClient.getAllLogs(address, topic, 1, 1),
      ).toBeRejected()

      expect(provider.getLogs).toHaveBeenOnlyCalledWith({
        address: address.toString(),
        topics: [topic],
        fromBlock: 1,
        toBlock: 1,
      })
    })
  })
})
