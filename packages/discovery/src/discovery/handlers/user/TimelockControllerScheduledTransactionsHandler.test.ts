import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { BigNumber, type providers, utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import { TimelockControllerScheduledTransactionsHandler } from './TimelockControllerScheduledTransactionsHandler'

describe(TimelockControllerScheduledTransactionsHandler.name, () => {
  const abi = new utils.Interface([
    'event CallScheduled(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay)',
    'event CallExecuted(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data)',
    'event Cancelled(bytes32 indexed id)',
  ])
  const targetAbi = new utils.Interface([
    'function setMinDelay(uint256 newDelay)',
    'function upgradeTo(address newImplementation)',
  ])

  const TARGET = EthereumAddress.random()
  const ZERO32 = '0x' + '0'.repeat(64)
  const id = (n: number) => '0x' + n.toString(16).padStart(64, '0')

  function scheduled(
    opId: string,
    index: number,
    data: string,
    blockNumber: number,
    delay = 86400,
  ): providers.Log {
    const log = abi.encodeEventLog(abi.getEvent('CallScheduled'), [
      opId,
      index,
      TARGET,
      0,
      data,
      ZERO32,
      delay,
    ]) as providers.Log
    return { ...log, blockNumber }
  }
  function executed(opId: string, index: number, data: string): providers.Log {
    return {
      ...(abi.encodeEventLog(abi.getEvent('CallExecuted'), [
        opId,
        index,
        TARGET,
        0,
        data,
      ]) as providers.Log),
      blockNumber: 0,
    }
  }
  function cancelled(opId: string): providers.Log {
    return {
      ...(abi.encodeEventLog(abi.getEvent('Cancelled'), [
        opId,
      ]) as providers.Log),
      blockNumber: 0,
    }
  }

  const setDelay = targetAbi.encodeFunctionData('setMinDelay', [172800])
  const upgrade = targetAbi.encodeFunctionData('upgradeTo', [TARGET])
  const unknownSelector = '0xdeadbeef' + '00'.repeat(32)

  function makeProvider(
    logs: providers.Log[],
    readyAt: Record<string, number>,
  ) {
    const timelock = ChainSpecificAddress.random()
    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      timestamp: 1_700_000_000,
      async getLogs(address, topics) {
        expect(address).toEqual(timelock)
        expect(topics).toEqual([
          [
            abi.getEventTopic('CallScheduled'),
            abi.getEventTopic('CallExecuted'),
            abi.getEventTopic('Cancelled'),
          ],
        ])
        return logs
      },
      async callMethod<T>(
        _address: ChainSpecificAddress,
        _abi: string | utils.FunctionFragment,
        args: unknown[],
      ): Promise<T | undefined> {
        return BigNumber.from(readyAt[args[0] as string] ?? 0) as unknown as T
      },
      async getSource() {
        // a plain object: awaiting an earl mock would touch its .then
        return {
          abi: targetAbi.format('full') as string[],
        } as unknown as Awaited<ReturnType<IProvider['getSource']>>
      },
    })
    return { provider, timelock }
  }

  it('keeps only operations that are neither executed nor cancelled', async () => {
    const logs = [
      scheduled(id(1), 0, setDelay, 100), // pending, ready
      scheduled(id(2), 0, upgrade, 101), // executed below
      executed(id(2), 0, upgrade),
      scheduled(id(3), 0, upgrade, 102), // cancelled below
      cancelled(id(3)),
      scheduled(id(4), 0, setDelay, 103), // batch of two, pending, not ready
      scheduled(id(4), 1, upgrade, 103),
      scheduled(id(3), 0, upgrade, 104), // rescheduled after cancel: pending again
    ]
    const { provider, timelock } = makeProvider(logs, {
      [id(1)]: 1_699_000_000,
      [id(3)]: 1_700_500_000,
      [id(4)]: 1_700_500_000,
    })
    const handler = new TimelockControllerScheduledTransactionsHandler(
      'scheduledOperations',
    )

    const result = await handler.execute(provider, timelock)

    expect(result).toEqual({
      field: 'scheduledOperations',
      ignoreRelative: true,
      value: [
        {
          id: id(1),
          scheduledAtBlock: 100,
          delay: '86400',
          readyAt: 1_699_000_000,
          ready: true,
          predecessor: ZERO32,
          calls: [
            {
              target: TARGET.toString(),
              value: '0',
              function: 'setMinDelay',
              inputs: { newDelay: 172800 },
            },
          ],
        },
        {
          id: id(4),
          scheduledAtBlock: 103,
          delay: '86400',
          readyAt: 1_700_500_000,
          ready: false,
          predecessor: ZERO32,
          calls: [
            {
              target: TARGET.toString(),
              value: '0',
              function: 'setMinDelay',
              inputs: { newDelay: 172800 },
            },
            {
              target: TARGET.toString(),
              value: '0',
              function: 'upgradeTo',
              inputs: { newImplementation: TARGET.toString() },
            },
          ],
        },
        {
          id: id(3),
          scheduledAtBlock: 104,
          delay: '86400',
          readyAt: 1_700_500_000,
          ready: false,
          predecessor: ZERO32,
          calls: [
            {
              target: TARGET.toString(),
              value: '0',
              function: 'upgradeTo',
              inputs: { newImplementation: TARGET.toString() },
            },
          ],
        },
      ],
    })
  })

  it('keeps the raw calldata when the selector is unknown', async () => {
    const logs = [scheduled(id(7), 0, unknownSelector, 50)]
    const { provider, timelock } = makeProvider(logs, {
      [id(7)]: 1_700_500_000,
    })
    // no proxy behind the target: detection finds nothing to try
    const handler = new TimelockControllerScheduledTransactionsHandler('ops')
    handler.decodeCalldata = async () => {
      throw new Error('Selector not found in target or implementation ABI')
    }

    const result = await handler.execute(provider, timelock)

    expect(result.value).toEqual([
      {
        id: id(7),
        scheduledAtBlock: 50,
        delay: '86400',
        readyAt: 1_700_500_000,
        ready: false,
        predecessor: ZERO32,
        calls: [
          {
            target: TARGET.toString(),
            value: '0',
            function: '0xdeadbeef',
            inputs: { calldata: unknownSelector },
            decodingFailed: true,
          },
        ],
      },
    ])
  })

  it('returns an empty list when nothing is scheduled', async () => {
    const { provider, timelock } = makeProvider([], {})
    const handler = new TimelockControllerScheduledTransactionsHandler('ops')
    const result = await handler.execute(provider, timelock)
    expect(result).toEqual({ field: 'ops', value: [], ignoreRelative: true })
  })
})
