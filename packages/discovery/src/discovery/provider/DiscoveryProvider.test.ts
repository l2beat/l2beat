import { expect, mockFn, MockObject, mockObject } from 'earl'
import { providers } from 'ethers'

import { EthereumAddress } from '../../utils/EthereumAddress'
import { EtherscanLikeClient } from '../../utils/EtherscanLikeClient'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { DiscoveryProvider } from './DiscoveryProvider'

const rangesFromCalls = (provider: MockObject<providers.JsonRpcProvider>) =>
  provider.getLogs.calls.map((call) => {
    const arg0 = call.args[0] as providers.Filter
    return [arg0.fromBlock, arg0.toBlock]
  })

const GETLOGS_MAX_RANGE = 10000

describe(DiscoveryProvider.name, () => {
  describe(DiscoveryProvider.prototype.getLogs.name, () => {
    const etherscanLikeClientMock = mockObject<EtherscanLikeClient>({})
    const address = EthereumAddress.random()
    const topics = ['testTopic']
    let providerMock: MockObject<providers.JsonRpcProvider>
    let discoveryProviderMock: DiscoveryProvider

    beforeEach(() => {
      providerMock = mockObject<providers.JsonRpcProvider>({
        getLogs: mockFn().resolvesTo([]),
      })
      discoveryProviderMock = new DiscoveryProvider(
        providerMock,
        etherscanLikeClientMock,
        DiscoveryLogger.SILENT,
        GETLOGS_MAX_RANGE,
      )
      discoveryProviderMock.getDeploymentInfo = mockFn().resolvesTo({
        blockNumber: 0,
        timestamp: 0,
      })
    })

    it('handles simple range', async () => {
      await discoveryProviderMock.getLogs(address, topics, 5000, 35000)
      const ranges = rangesFromCalls(providerMock)
      expect(ranges).toEqual([
        [5000, 9999],
        [10000, 19999],
        [20000, 29999],
        [30000, 35000],
      ])
    })

    it('handles range at boundaries', async () => {
      await discoveryProviderMock.getLogs(address, topics, 10000, 39999)
      const ranges = rangesFromCalls(providerMock)
      expect(ranges).toEqual([
        [10000, 19999],
        [20000, 29999],
        [30000, 39999],
      ])
    })

    it('handles range at +/- 1 of boundaries', async () => {
      await discoveryProviderMock.getLogs(address, topics, 9999, 30000)
      const ranges = rangesFromCalls(providerMock)
      expect(ranges).toEqual([
        [9999, 9999],
        [10000, 19999],
        [20000, 29999],
        [30000, 30000],
      ])
    })

    it('handles range where from and to are equal and multiply or range', async () => {
      await discoveryProviderMock.getLogs(address, topics, 10000, 10000)
      const ranges = rangesFromCalls(providerMock)
      expect(ranges).toEqual([[10000, 10000]])
    })

    it('handles range where from and to are -1 of multiply or range', async () => {
      await discoveryProviderMock.getLogs(address, topics, 9999, 9999)
      const ranges = rangesFromCalls(providerMock)
      expect(ranges).toEqual([[9999, 9999]])
    })

    it('handles range where from and to are +1 of multiply or range', async () => {
      await discoveryProviderMock.getLogs(address, topics, 10001, 10001)
      const ranges = rangesFromCalls(providerMock)
      expect(ranges).toEqual([[10001, 10001]])
    })

    it('handles range [0,0]', async () => {
      await discoveryProviderMock.getLogs(address, topics, 0, 0)
      const ranges = rangesFromCalls(providerMock)
      expect(ranges).toEqual([[0, 0]])
    })

    it('handles range [1,1]', async () => {
      await discoveryProviderMock.getLogs(address, topics, 1, 1)
      const ranges = rangesFromCalls(providerMock)
      expect(ranges).toEqual([[1, 1]])
    })

    it('handles range inside boundaries', async () => {
      await discoveryProviderMock.getLogs(address, topics, 1400, 1600)
      const ranges = rangesFromCalls(providerMock)
      expect(ranges).toEqual([[1400, 1600]])
    })

    it('handles getLogsMaxRange undefined (no range)', async () => {
      providerMock = mockObject<providers.JsonRpcProvider>({
        getLogs: mockFn().resolvesTo([]),
      })
      discoveryProviderMock = new DiscoveryProvider(
        providerMock,
        etherscanLikeClientMock,
        DiscoveryLogger.SILENT,
        undefined, // PROVIDING UNDEFINED for getLogsMaxRange, so no batching
      )
      discoveryProviderMock.getDeploymentInfo = mockFn().resolvesTo({
        blockNumber: 0,
        timestamp: 0,
      })
      await discoveryProviderMock.getLogs(address, topics, 5000, 35000)
      const ranges = rangesFromCalls(providerMock)
      expect(ranges).toEqual([[5000, 35000]])
    })

    it('starts with deployment block if bigger then fromBlock', async () => {
      providerMock = mockObject<providers.JsonRpcProvider>({
        getLogs: mockFn().resolvesTo([]),
      })
      discoveryProviderMock = new DiscoveryProvider(
        providerMock,
        etherscanLikeClientMock,
        DiscoveryLogger.SILENT,
        GETLOGS_MAX_RANGE,
      )
      discoveryProviderMock.getDeploymentInfo = mockFn().resolvesTo({
        blockNumber: 16000,
        timestamp: 0,
      })

      await discoveryProviderMock.getLogs(address, topics, 5000, 35000)
      const ranges = rangesFromCalls(providerMock)
      expect(ranges).toEqual([
        [16000, 19999],
        [20000, 29999],
        [30000, 35000],
      ])
    })
  })
})
