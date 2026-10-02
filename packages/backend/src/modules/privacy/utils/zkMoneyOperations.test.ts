import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import type { PrivacyRpcLog } from '../types'
import { erc20Interface } from './erc20'
import { zkMoneyInterface } from './zkMoneyEvents'
import {
  findZkMoneyDepositFinalizer,
  findZkMoneyDepositor,
  findZkMoneyWithdrawalFinalizer,
} from './zkMoneyOperations'

const address = (n: number) =>
  EthereumAddress(`0x${n.toString(16).padStart(40, '0')}`)
const TOKEN = address(1)
const PORTAL = address(2)
const DEPOSIT_ADDRESS = address(3)
const RELAYER = address(4)
const CALLER = address(5)
const HELPER = address(6)
const EXECUTOR = address(7)
const RECIPIENT = address(8)
const FEE_FUNDER = address(9)
const params = { tokenAddress: TOKEN, operationExecutor: HELPER }
const withdrawalParams = { ...params, executorAddress: EXECUTOR }

// Receipts are built by hand in the order the verified contracts emit their
// logs, so each test states which part of that order the reader relies on.
describe('zk.money portal operations', () => {
  describe(findZkMoneyDepositor.name, () => {
    it('recognises a deposit address by the sweep that follows the deposit', () => {
      const receipt = sweep({ index: 1, relayer: RELAYER })

      expect(findZkMoneyDepositor(receipt, deposit(1), TOKEN)).toEqual({
        address: DEPOSIT_ADDRESS.toLowerCase(),
        isDepositAddress: true,
      })
    })

    it('treats a depositor that was not swept as depositing directly', () => {
      const receipt = [transfer(CALLER, PORTAL, 100n), deposit(1)]

      expect(findZkMoneyDepositor(receipt, deposit(1), TOKEN)).toEqual({
        address: CALLER.toLowerCase(),
        isDepositAddress: false,
      })
    })

    it('uses the transfer the portal pulled, not an earlier donation', () => {
      const receipt = [
        transfer(RELAYER, PORTAL, 5n),
        transfer(CALLER, PORTAL, 100n),
        transfer(PORTAL, FEE_FUNDER, 1n),
        deposit(1),
      ]

      expect(findZkMoneyDepositor(receipt, deposit(1), TOKEN)?.address).toEqual(
        CALLER.toLowerCase(),
      )
    })

    it('ignores transfers of other tokens', () => {
      const receipt = [transfer(CALLER, PORTAL, 100n, address(99)), deposit(1)]

      expect(findZkMoneyDepositor(receipt, deposit(1), TOKEN)).toEqual(
        undefined,
      )
    })
  })

  describe(findZkMoneyDepositFinalizer.name, () => {
    it('returns the relayer the sweep paid', () => {
      const receipt = sweep({ index: 1, relayer: RELAYER })

      expect(findZkMoneyDepositFinalizer(receipt, deposit(1), params)).toEqual(
        RELAYER,
      )
    })

    it('follows the helper to its caller, who also receives subsidies', () => {
      const receipt = [
        ...sweep({ index: 1, relayer: HELPER }),
        transfer(HELPER, CALLER, 7n),
      ]

      expect(findZkMoneyDepositFinalizer(receipt, deposit(1), params)).toEqual(
        CALLER,
      )
    })

    it('finds nobody when the helper forwards to several addresses', () => {
      const receipt = [
        ...sweep({ index: 1, relayer: HELPER }),
        transfer(HELPER, CALLER, 2n),
        transfer(HELPER, RELAYER, 2n),
      ]

      expect(findZkMoneyDepositFinalizer(receipt, deposit(1), params)).toEqual(
        undefined,
      )
    })

    it('finds nobody for a direct deposit, which pays no fee', () => {
      const receipt = [transfer(CALLER, PORTAL, 100n), deposit(1)]

      expect(findZkMoneyDepositFinalizer(receipt, deposit(1), params)).toEqual(
        undefined,
      )
    })

    it('keeps batched sweeps apart', () => {
      const receipt = [
        ...sweep({ index: 1, relayer: RELAYER }),
        ...sweep({ index: 2, relayer: CALLER }),
      ]

      expect(findZkMoneyDepositFinalizer(receipt, deposit(1), params)).toEqual(
        RELAYER,
      )
      expect(findZkMoneyDepositFinalizer(receipt, deposit(2), params)).toEqual(
        CALLER,
      )
    })
  })

  describe(findZkMoneyWithdrawalFinalizer.name, () => {
    it('returns the tip recipient', () => {
      const receipt = [
        transfer(PORTAL, EXECUTOR, 100n),
        transfer(EXECUTOR, RECIPIENT, 98n),
        transfer(EXECUTOR, RELAYER, 2n),
        withdrawal(1),
      ]

      expect(
        findZkMoneyWithdrawalFinalizer(
          receipt,
          withdrawal(1),
          withdrawalParams,
        ),
      ).toEqual(RELAYER)
    })

    it('follows the helper to its caller', () => {
      const receipt = [
        transfer(PORTAL, EXECUTOR, 100n),
        transfer(EXECUTOR, RECIPIENT, 98n),
        transfer(EXECUTOR, HELPER, 2n),
        withdrawal(1),
        transfer(HELPER, CALLER, 2n),
      ]

      expect(
        findZkMoneyWithdrawalFinalizer(
          receipt,
          withdrawal(1),
          withdrawalParams,
        ),
      ).toEqual(CALLER)
    })

    it('finds nobody when no tip was paid', () => {
      const receipt = [
        transfer(PORTAL, EXECUTOR, 100n),
        transfer(EXECUTOR, RECIPIENT, 100n),
        withdrawal(1),
      ]

      expect(
        findZkMoneyWithdrawalFinalizer(
          receipt,
          withdrawal(1),
          withdrawalParams,
        ),
      ).toEqual(undefined)
    })

    it('finds nobody for executors whose payout order is unknown', () => {
      const custom = address(50)
      const receipt = [
        transfer(custom, RECIPIENT, 98n),
        transfer(custom, RELAYER, 2n),
        withdrawal(1, custom),
      ]

      expect(
        findZkMoneyWithdrawalFinalizer(
          receipt,
          withdrawal(1, custom),
          withdrawalParams,
        ),
      ).toEqual(undefined)
    })
  })
})

/** A sweep pays the relayer, funds the portal, and logs Sweep after the portal's Deposit. */
function sweep({
  index,
  relayer,
}: {
  index: number
  relayer: EthereumAddress
}): PrivacyRpcLog[] {
  return [
    transfer(DEPOSIT_ADDRESS, relayer, 2n),
    transfer(DEPOSIT_ADDRESS, PORTAL, 101n),
    transfer(PORTAL, FEE_FUNDER, 1n),
    deposit(index),
    event(zkMoneyInterface, 'Sweep', DEPOSIT_ADDRESS, [index, 100]),
  ]
}

function deposit(index: number): PrivacyRpcLog {
  return event(zkMoneyInterface, 'Deposit', PORTAL, [
    utils.hexZeroPad('0x01', 32),
    100,
    utils.hexZeroPad('0x02', 32),
    index,
  ])
}

function withdrawal(id: number, executor = EXECUTOR): PrivacyRpcLog {
  return event(zkMoneyInterface, 'WithdrawalOrRefund', PORTAL, [
    0,
    utils.hexZeroPad(utils.hexlify(id), 32),
    executor,
    100,
  ])
}

function transfer(
  from: string,
  to: string,
  amount: bigint,
  token: string = TOKEN,
): PrivacyRpcLog {
  return event(erc20Interface, 'Transfer', token, [from, to, amount])
}

function event(
  contractInterface: utils.Interface,
  name: string,
  contract: string,
  args: unknown[],
): PrivacyRpcLog {
  return { ...contractInterface.encodeEventLog(name, args), address: contract }
}
