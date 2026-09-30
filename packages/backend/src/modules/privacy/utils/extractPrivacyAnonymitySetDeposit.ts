import type { PrivacyAnonymitySetDepositSource } from '@l2beat/config'
import { assert, assertUnreachable, EthereumAddress } from '@l2beat/shared-pure'
import type { PrivacyRpcLog } from '../types'
import { erc20Interface } from './erc20'
import { extractPrivacyFlow } from './extractPrivacyFlow'
import { extractPrivacyPoolsEvent } from './extractPrivacyPoolsEvent'

export type PrivacyAnonymitySetDeposit = {
  amount: bigint
  origin: { type: 'event'; sender: EthereumAddress } | { type: 'transaction' }
}

export function extractPrivacyAnonymitySetDeposit(
  source: PrivacyAnonymitySetDepositSource,
  log: PrivacyRpcLog,
): PrivacyAnonymitySetDeposit | undefined {
  if (source.extractor === 'privacyPoolsValue') {
    const result = extractPrivacyPoolsEvent(log)
    assert(result.depositor, 'Privacy Pools deposit is missing depositor')

    return {
      amount: result.amount,
      origin: { type: 'event', sender: result.depositor },
    }
  }

  const result = extractPrivacyFlow(source, log)
  if (result === undefined) return undefined

  switch (source.extractor) {
    case 'fixedAmount':
    case 'railgunShield':
      return {
        amount: result.amount,
        origin: { type: 'transaction' },
      }
    case 'erc20Transfer':
      return {
        amount: result.amount,
        origin: {
          type: 'event',
          sender: EthereumAddress(erc20Interface.parseLog(log).args.from),
        },
      }
    default:
      return assertUnreachable(source)
  }
}
