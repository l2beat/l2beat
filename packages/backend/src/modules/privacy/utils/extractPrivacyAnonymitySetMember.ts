import type { ZkMoneyFundingParams } from '@l2beat/config'
import { assert, assertUnreachable, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { EvmPrivacyAnonymitySetSource, PrivacyRpcLog } from '../types'
import { extractPrivacyFlow } from './extractPrivacyFlow'
import { extractPrivacyPoolsEvent } from './extractPrivacyPoolsEvent'

const umbraRegistryInterface = new utils.Interface([
  'event StealthKeyChanged(address indexed registrant, uint256 spendingPubKeyPrefix, uint256 spendingPubKey, uint256 viewingPubKeyPrefix, uint256 viewingPubKey)',
])

/**
 * A sender joining an anonymity set, with the amount they deposited. Key
 * registrations deposit nothing, so their amount is 0.
 */
export type PrivacyAnonymitySetMember = {
  amount: bigint
  origin:
    | { type: 'event'; sender: EthereumAddress }
    | { type: 'transaction' }
    /** Funded through a zk.money deposit address, traced by replaying its history. */
    | { type: 'tracedFunder'; params: ZkMoneyFundingParams }
}

export function extractPrivacyAnonymitySetMember(
  source: EvmPrivacyAnonymitySetSource,
  log: PrivacyRpcLog,
): PrivacyAnonymitySetMember | undefined {
  switch (source.extractor) {
    case 'umbraStealthKeyChanged': {
      // Keys can be registered on someone's behalf with their signature, so the
      // registrant comes from the event rather than the transaction sender.
      const parsedLog = umbraRegistryInterface.parseLog(log)
      return {
        amount: 0n,
        origin: {
          type: 'event',
          sender: EthereumAddress(parsedLog.args.registrant),
        },
      }
    }
    case 'privacyPoolsValue': {
      const result = extractPrivacyPoolsEvent(log)
      assert(result.depositor, 'Privacy Pools deposit is missing depositor')
      return toDeposit(result.amount, {
        type: 'event',
        sender: result.depositor,
      })
    }
    // Yield deposits reach the vault through a router, so the Entrypoint's
    // depositor is the router and only the transaction sender names the user.
    case 'fixedAmount':
    case 'privacyPoolsV2Value':
    case 'railgunShield': {
      const result = extractPrivacyFlow(source, log)
      if (result === undefined) return undefined
      return toDeposit(result.amount, { type: 'transaction' })
    }
    case 'zkMoneyDeposit': {
      const result = extractPrivacyFlow(source, log)
      if (result === undefined) return undefined
      return toDeposit(result.amount, {
        type: 'tracedFunder',
        params: source.params,
      })
    }
    default:
      return assertUnreachable(source)
  }
}

/** A zero-value deposit adds no one to the set. */
function toDeposit(
  amount: bigint,
  origin: PrivacyAnonymitySetMember['origin'],
): PrivacyAnonymitySetMember | undefined {
  return amount === 0n ? undefined : { amount, origin }
}
