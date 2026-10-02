import type { ZkMoneyDepositConfig } from '@l2beat/config'
import type { IRpcClient, LogsProvider } from '@l2beat/shared'
import { EthereumAddress, type Log } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import { ERC20_TRANSFER_TOPIC, erc20Interface } from './erc20'
import { eventKey, zkMoneyInterface } from './zkMoneyEvents'
import { findFunder, findZkMoneyDepositSenders } from './zkMoneyFunders'

const address = (n: number) =>
  EthereumAddress(`0x${n.toString(16).padStart(40, '0')}`)
const DAI = address(1)
const USDC = address(2)
const PORTAL = address(3)
const DEPOSIT_ADDRESS = address(4)
const ALICE = address(5)
const BOB = address(6)
const EXCHANGE = address(7)
const params: ZkMoneyDepositConfig = {
  tokenAddress: DAI,
  fundingTokens: [DAI, USDC],
  exchangeAddress: EXCHANGE,
}

// Logs are placed by block number, the way eth_getLogs returns them, so each
// test states what the deposit address received and when it was emptied.
describe('zk.money deposit senders', () => {
  describe(findFunder.name, () => {
    it('returns the only address that funded the deposit', () => {
      const funding = [
        transfer(ALICE, DEPOSIT_ADDRESS, 10),
        transfer(ALICE, DEPOSIT_ADDRESS, 11),
      ]

      expect(funderOf(deposit(20), funding)).toEqual(ALICE.toLowerCase())
    })

    it('finds nobody when several addresses funded it', () => {
      const funding = [
        transfer(ALICE, DEPOSIT_ADDRESS, 10),
        transfer(BOB, DEPOSIT_ADDRESS, 11),
      ]

      expect(funderOf(deposit(20), funding)).toEqual(undefined)
    })

    it('starts over once the address was swept or recovered', () => {
      const funding = [
        transfer(ALICE, DEPOSIT_ADDRESS, 10),
        transfer(BOB, DEPOSIT_ADDRESS, 30),
      ]

      expect(funderOf(deposit(20), funding, [emptied('Sweep', 21)])).toEqual(
        ALICE.toLowerCase(),
      )
      expect(funderOf(deposit(40), funding, [emptied('Sweep', 21)])).toEqual(
        BOB.toLowerCase(),
      )
      expect(
        funderOf(deposit(40), funding, [emptied('Recovered', 21)]),
      ).toEqual(BOB.toLowerCase())
    })

    it('ignores funding that arrived after the deposit', () => {
      const funding = [
        transfer(ALICE, DEPOSIT_ADDRESS, 10),
        transfer(BOB, DEPOSIT_ADDRESS, 21),
      ]

      expect(funderOf(deposit(20), funding)).toEqual(ALICE.toLowerCase())
    })

    it('credits swapped funding to whoever sent the swapped token', () => {
      const funding = [
        transfer(ALICE, DEPOSIT_ADDRESS, 10, USDC),
        transfer(EXCHANGE, DEPOSIT_ADDRESS, 19),
      ]

      expect(funderOf(deposit(20), funding)).toEqual(ALICE.toLowerCase())
    })

    it('finds nobody for minted tokens, which have no sender', () => {
      const funding = [
        transfer(EthereumAddress.ZERO, DEPOSIT_ADDRESS, 10, USDC),
      ]

      expect(funderOf(deposit(20), funding)).toEqual(undefined)
    })

    it('ignores funding of other deposit addresses', () => {
      const funding = [
        transfer(ALICE, DEPOSIT_ADDRESS, 10),
        transfer(BOB, address(99), 11),
      ]

      expect(funderOf(deposit(20), funding)).toEqual(ALICE.toLowerCase())
    })
  })

  describe(findZkMoneyDepositSenders.name, () => {
    it('reads a direct depositor from the transaction without scanning for funding', async () => {
      const log = deposit(20)
      const getLogs = mockFn<LogsProvider['getLogs']>()

      const senders = await findZkMoneyDepositSenders(
        [log],
        params,
        {
          rpcClient: rpcWithReceipt([transfer(ALICE, PORTAL, 20), log]),
          logsProvider: mockObject<LogsProvider>({ getLogs }),
        },
        5,
      )

      expect(senders).toEqual(new Map([[eventKey(log), ALICE.toLowerCase()]]))
      expect(getLogs).not.toHaveBeenCalled()
    })

    it('scans the lookback range for whoever funded a swept deposit address', async () => {
      const log = deposit(20)
      const sweep = emptied('Sweep', 20, 1)
      const getLogs = mockFn<LogsProvider['getLogs']>()
        .resolvesToOnce([transfer(ALICE, DEPOSIT_ADDRESS, 10)])
        .resolvesToOnce([sweep])

      const senders = await findZkMoneyDepositSenders(
        [log],
        params,
        {
          rpcClient: rpcWithReceipt([
            transfer(DEPOSIT_ADDRESS, PORTAL, 20),
            log,
            sweep,
          ]),
          logsProvider: mockObject<LogsProvider>({ getLogs }),
        },
        5,
      )

      expect(senders).toEqual(new Map([[eventKey(log), ALICE.toLowerCase()]]))
      expect(getLogs).toHaveBeenNthCalledWith(
        1,
        5,
        20,
        [DAI, USDC],
        [
          [ERC20_TRANSFER_TOPIC],
          null,
          [utils.hexZeroPad(DEPOSIT_ADDRESS.toLowerCase(), 32)],
        ],
      )
      expect(getLogs).toHaveBeenNthCalledWith(
        2,
        5,
        20,
        [DEPOSIT_ADDRESS.toLowerCase()],
        [
          [
            zkMoneyInterface.getEventTopic('Sweep'),
            zkMoneyInterface.getEventTopic('Recovered'),
          ],
        ],
      )
    })
  })
})

function funderOf(log: Log, funding: Log[], emptiedLogs: Log[] = []) {
  return findFunder(
    { log, depositAddress: DEPOSIT_ADDRESS.toLowerCase() },
    funding,
    emptiedLogs,
    params,
  )
}

function rpcWithReceipt(logs: Log[]) {
  return mockObject<IRpcClient>({
    getTransactionReceipt: mockFn().resolvesTo({ logs }),
  })
}

function deposit(blockNumber: number): Log {
  return event(zkMoneyInterface, 'Deposit', PORTAL, blockNumber, [
    utils.hexZeroPad('0x01', 32),
    100,
    utils.hexZeroPad('0x02', 32),
    1,
  ])
}

function emptied(
  name: 'Sweep' | 'Recovered',
  blockNumber: number,
  logIndex = 0,
) {
  const args = name === 'Sweep' ? [1, 100] : [DAI, ALICE, 100]
  return {
    ...event(zkMoneyInterface, name, DEPOSIT_ADDRESS, blockNumber, args),
    logIndex,
  }
}

function transfer(
  from: string,
  to: string,
  blockNumber: number,
  token: string = DAI,
): Log {
  return event(erc20Interface, 'Transfer', token, blockNumber, [from, to, 100])
}

function event(
  contractInterface: utils.Interface,
  name: string,
  contract: string,
  blockNumber: number,
  args: unknown[],
): Log {
  return {
    ...contractInterface.encodeEventLog(name, args),
    address: contract,
    blockNumber,
    blockHash: '0xblock',
    transactionHash: '0xtx',
    logIndex: 0,
  }
}
