import type { LogsProvider } from '@l2beat/shared'
import { EthereumAddress, type Log, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import {
  ALICE,
  BLOCK_NUMBER,
  BOB,
  DAI,
  DEPOSIT_FEE,
  FUNDED,
  FUNDING_PARAMS,
  mockZkMoneyRpc,
  PORTAL,
  portalDeposit,
  recovered,
  SIPA,
  sweep,
  transfer,
} from './test/fixtures'
import {
  FUNDING_LOOKBACK,
  type TraceFundersDependencies,
  traceZkMoneyFunders,
} from './traceFunders'

// One portal deposit swept from SIPA, with a synthetic receipt and token
// history encoded with the real ABIs. The RPC mock plays the SIPA factory and
// the token balances; the logs mock serves the history in query order
// (transfers into SIPAs, transfers out of SIPAs, Sweep / Recovered events).
const DEPOSIT_TIMESTAMP = UnixTime(1_800_000_000)
const LOOKBACK_BLOCK = 15

describe(traceZkMoneyFunders.name, () => {
  it('attributes a SIPA deposit to the funder replayed from its history', async () => {
    const { portalEvent, receipt, outgoing, sweepEvent } = sweptDeposit()
    const logsProvider = mockLogsProvider([
      [transfer(ALICE, SIPA, FUNDED + DEPOSIT_FEE, earlierBlock(18, 0))],
      outgoing,
      [sweepEvent],
    ])

    const funders = await trace(portalEvent, {
      rpc: mockZkMoneyRpc({ receipt }),
      logsProvider,
    })

    expect(funders).toEqual(new Map([[portalEvent, ALICE]]))
  })

  it('attributes a direct deposit to its sender without scanning history', async () => {
    const portalEvent = portalDeposit(1, { logIndex: 4 })
    const logsProvider = mockLogsProvider([])

    const funders = await trace(portalEvent, {
      rpc: mockZkMoneyRpc({
        receipt: [
          transfer(ALICE, PORTAL, FUNDED, { logIndex: 3 }),
          portalEvent,
        ],
        implementation: EthereumAddress.ZERO,
      }),
      logsProvider,
    })

    expect(funders).toEqual(new Map([[portalEvent, ALICE]]))
    expect(logsProvider.getLogs).not.toHaveBeenCalled()
  })

  it('leaves a deposit from a clone the factory does not vouch for unattributed', async () => {
    const { portalEvent, receipt } = sweptDeposit()
    const logsProvider = mockLogsProvider([])

    const funders = await trace(portalEvent, {
      rpc: mockZkMoneyRpc({ receipt, intent: 0 }),
      logsProvider,
    })

    expect(funders).toEqual(new Map())
    expect(logsProvider.getLogs).not.toHaveBeenCalled()
  })

  describe('lookback window', () => {
    it('scans history from the lookback block and reads balances just before it', async () => {
      const { portalEvent, receipt } = sweptDeposit()
      const rpc = mockZkMoneyRpc({ receipt })
      const logsProvider = mockLogsProvider([[], [], []])
      const getBlockNumberAtOrBefore = mockFn().resolvesTo(LOOKBACK_BLOCK)

      await trace(portalEvent, { rpc, logsProvider, getBlockNumberAtOrBefore })

      expect(getBlockNumberAtOrBefore).toHaveBeenOnlyCalledWith(
        UnixTime(DEPOSIT_TIMESTAMP - FUNDING_LOOKBACK),
      )
      for (const call of logsProvider.getLogs.calls) {
        expect(call.args.slice(0, 2)).toEqual([LOOKBACK_BLOCK, BLOCK_NUMBER])
      }
      expect(
        rpc.call.calls
          .filter(({ args }) => args[0].to === DAI)
          .map(({ args }) => args[1]),
      ).toEqual([LOOKBACK_BLOCK - 1])
    })

    it('never scans before the SIPA factory deployment', async () => {
      const { portalEvent, receipt } = sweptDeposit()
      const logsProvider = mockLogsProvider([[], [], []])

      await trace(portalEvent, {
        rpc: mockZkMoneyRpc({ receipt }),
        logsProvider,
        getBlockNumberAtOrBefore: mockFn().resolvesTo(1),
      })

      expect(logsProvider.getLogs.calls[0]?.args[0]).toEqual(
        FUNDING_PARAMS.historyFromBlock,
      )
    })

    it('leaves a deposit unattributed when the SIPA held funds before the window', async () => {
      const { portalEvent, receipt, outgoing, sweepEvent } = sweptDeposit()
      const topUp = FUNDED + DEPOSIT_FEE - 10n
      const logsProvider = mockLogsProvider([
        [transfer(ALICE, SIPA, topUp, earlierBlock(18, 0))],
        outgoing,
        [sweepEvent],
      ])

      const funders = await trace(portalEvent, {
        rpc: mockZkMoneyRpc({ receipt, balances: new Map([[DAI, 10n]]) }),
        logsProvider,
      })

      expect(funders).toEqual(new Map())
    })

    it('attributes a deposit once the balance held before the window was emptied', async () => {
      const { portalEvent, receipt, outgoing, sweepEvent } = sweptDeposit()
      const logsProvider = mockLogsProvider([
        [transfer(BOB, SIPA, FUNDED + DEPOSIT_FEE, earlierBlock(18, 0))],
        [transfer(SIPA, ALICE, 10n, earlierBlock(16, 0)), ...outgoing],
        [recovered(DAI, ALICE, 10n, earlierBlock(16, 1)), sweepEvent],
      ])

      const funders = await trace(portalEvent, {
        rpc: mockZkMoneyRpc({ receipt, balances: new Map([[DAI, 10n]]) }),
        logsProvider,
      })

      expect(funders).toEqual(new Map([[portalEvent, BOB]]))
    })
  })
})

/** SIPA pays a fee to Bob, funds the portal, and emits the matching Sweep. */
function sweptDeposit() {
  const outgoing = [
    transfer(SIPA, BOB, DEPOSIT_FEE, { logIndex: 1 }),
    transfer(SIPA, PORTAL, FUNDED, { logIndex: 2 }),
  ]
  const portalEvent = portalDeposit(1, { logIndex: 4 })
  const sweepEvent = sweep(1, { logIndex: 5 })
  const receipt = [
    ...outgoing,
    transfer(PORTAL, BOB, 1n, { logIndex: 3 }),
    portalEvent,
    sweepEvent,
  ]
  return { portalEvent, receipt, outgoing, sweepEvent }
}

/** A log of an earlier transaction, in the given block. */
function earlierBlock(blockNumber: number, logIndex: number) {
  const transactionHash = `0x${blockNumber.toString(16).padStart(64, '0')}`
  return { blockNumber, logIndex, transactionHash }
}

function mockLogsProvider(responses: Log[][]) {
  const getLogs = mockFn<LogsProvider['getLogs']>()
  for (const response of responses) getLogs.resolvesToOnce(response)
  return mockObject<LogsProvider>({ getLogs })
}

function trace(
  portalEvent: Log,
  deps: Omit<TraceFundersDependencies, 'getBlockNumberAtOrBefore'> &
    Partial<TraceFundersDependencies>,
) {
  return traceZkMoneyFunders(
    [{ log: portalEvent, timestamp: DEPOSIT_TIMESTAMP }],
    FUNDING_PARAMS,
    {
      getBlockNumberAtOrBefore: async () => LOOKBACK_BLOCK,
      ...deps,
    },
  )
}
