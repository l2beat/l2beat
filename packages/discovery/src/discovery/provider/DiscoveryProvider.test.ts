import { expect, mockFn, MockObject, mockObject } from 'earl'
import { providers, utils } from 'ethers'

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

    describe('range tests', () => {
      it('handles simple range', async () => {
        await discoveryProviderMock.getLogs(address, topics, 5000, 35000)
        const ranges = rangesFromCalls(providerMock)
        expect(ranges).toEqual([
          [30000, 35000],
          [20000, 29999],
          [10000, 19999],
          [5000, 9999],
        ])
      })

      it('handles ranges while using the maxRange override', async () => {
        await discoveryProviderMock.getLogs(address, topics, 5000, 35000, {
          maxRange: 5000,
        })
        const ranges = rangesFromCalls(providerMock)
        expect(ranges).toEqual([
          [35000, 35000],
          [30000, 34999],
          [25000, 29999],
          [20000, 24999],
          [15000, 19999],
          [10000, 14999],
          [5000, 9999],
        ])
      })

      it('handles range at boundaries', async () => {
        await discoveryProviderMock.getLogs(address, topics, 10000, 39999)
        const ranges = rangesFromCalls(providerMock)
        expect(ranges).toEqual([
          [30000, 39999],
          [20000, 29999],
          [10000, 19999],
        ])
      })

      it('handles range at +/- 1 of boundaries', async () => {
        await discoveryProviderMock.getLogs(address, topics, 9999, 30000)
        const ranges = rangesFromCalls(providerMock)
        expect(ranges).toEqual([
          [30000, 30000],
          [20000, 29999],
          [10000, 19999],
          [9999, 9999],
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
          [30000, 35000],
          [20000, 29999],
          [16000, 19999],
        ])
      })
    })

    describe('ordering', () => {
      const abi = new utils.Interface(['event OrderingTestEvent(uint256 id)'])

      let eventId = 0
      function OrderingTestEvent(): providers.Log {
        return abi.encodeEventLog('OrderingTestEvent', [
          eventId++,
        ]) as providers.Log
      }

      function getEventId(log: providers.Log) {
        return abi.decodeEventLog('OrderingTestEvent', log.data).id.toNumber()
      }

      beforeEach(() => {
        eventId = 0
      })

      it('returns logs in order', async () => {
        const providerMock = mockObject<providers.JsonRpcProvider>({
          getLogs: mockFn()
            .resolvesToOnce([OrderingTestEvent()])
            .resolvesToOnce([OrderingTestEvent()])
            .resolvesToOnce([OrderingTestEvent()]),
        })

        const discoveryProviderMock = new DiscoveryProvider(
          providerMock,
          etherscanLikeClientMock,
          DiscoveryLogger.SILENT,
          GETLOGS_MAX_RANGE,
        )
        discoveryProviderMock.getDeploymentInfo = mockFn().resolvesTo({
          blockNumber: 0,
          timestamp: 0,
        })

        const events = await discoveryProviderMock.getLogs(
          address,
          topics,
          10000,
          39999,
        )

        expect(events.length).toEqual(3)
        expect(events.map(getEventId)).toEqual([2, 1, 0])
      })

      it('returns logs in order, when two logs are added in one call', async () => {
        const providerMock = mockObject<providers.JsonRpcProvider>({
          getLogs: mockFn()
            .resolvesToOnce([])
            .resolvesToOnce([OrderingTestEvent(), OrderingTestEvent()])
            .resolvesToOnce([OrderingTestEvent()]),
        })

        const discoveryProviderMock = new DiscoveryProvider(
          providerMock,
          etherscanLikeClientMock,
          DiscoveryLogger.SILENT,
          GETLOGS_MAX_RANGE,
        )
        discoveryProviderMock.getDeploymentInfo = mockFn().resolvesTo({
          blockNumber: 0,
          timestamp: 0,
        })

        const events = await discoveryProviderMock.getLogs(
          address,
          topics,
          10000,
          39999,
        )

        expect(events.length).toEqual(3)
        // We will see the logs in this order:
        // - first call: []
        // - second call: [0,1]
        // - third call: [2]
        // going backwards since we fetch starting at fromBlock and going
        // backwards it's going to be
        expect(events.map(getEventId)).toEqual([2, 0, 1])
      })
    })

    describe('filter tests', () => {
      const abi = new utils.Interface(['event TestEvent(bool passesFilter)'])

      function TestEvent(passesFilter: boolean): providers.Log {
        return abi.encodeEventLog('TestEvent', [passesFilter]) as providers.Log
      }

      function eventFilter(log: providers.Log) {
        return abi.decodeEventLog('TestEvent', log.data).passesFilter
      }

      let providerMock: MockObject<providers.JsonRpcProvider>
      let discoveryProviderMock: DiscoveryProvider

      beforeEach(() => {
        providerMock = mockObject<providers.JsonRpcProvider>({
          getLogs: mockFn()
            .resolvesToOnce([])
            .resolvesToOnce([
              TestEvent(false),
              TestEvent(false),
              TestEvent(true),
            ])
            .resolvesToOnce([TestEvent(true), TestEvent(true)])
            .resolvesToOnce([TestEvent(true)]),
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

      it('getLogs returns only filtered logs', async () => {
        const events = await discoveryProviderMock.getLogs(
          address,
          topics,
          10000,
          39999,
          {
            filter: (log) => eventFilter(log),
            howManyEvents: 1,
          },
        )

        expect(events.length).toEqual(1)
        // the last calls to getLogs shouldn't happen, sice we alreay found the event
        expect(providerMock.getLogs).toHaveBeenCalledTimes(2)
      })

      it('getLogs returns only filtered logs and respects the count', async () => {
        const events = await discoveryProviderMock.getLogs(
          address,
          topics,
          10000,
          39999,
          {
            howManyEvents: 2,
            filter: (log) => eventFilter(log),
          },
        )

        expect(events.length).toEqual(2)
        // the last call to getLogs shouldn't happen, sice we alreay found the event
        expect(providerMock.getLogs).toHaveBeenCalledTimes(3)
      })

      it('getLogs respects the count', async () => {
        const events = await discoveryProviderMock.getLogs(
          address,
          topics,
          10000,
          39999,
          {
            howManyEvents: 2,
          },
        )

        expect(events.length).toEqual(2)
        expect(events.every((log) => eventFilter(log) === false)).toBeTruthy()
        // the last calls to getLogs shouldn't happen, sice we alreay found the event
        expect(providerMock.getLogs).toHaveBeenCalledTimes(2)
      })
    })
  })
})
