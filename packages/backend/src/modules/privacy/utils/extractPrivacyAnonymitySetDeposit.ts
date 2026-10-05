import {
  assert,
  assertUnreachable,
  type EthereumAddress,
} from '@l2beat/shared-pure'
import type {
  EvmPrivacyAnonymitySetDepositSource,
  PrivacyRpcLog,
} from '../types'
import { extractPrivacyFlow } from './extractPrivacyFlow'
import { extractPrivacyPoolsEvent } from './extractPrivacyPoolsEvent'

export type PrivacyAnonymitySetDeposit = {
  amount: bigint
  origin: { type: 'event'; sender: EthereumAddress } | { type: 'transaction' }
}

export function extractPrivacyAnonymitySetDeposit(
  source: EvmPrivacyAnonymitySetDepositSource,
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
    default:
      return assertUnreachable(source)
  }
}
