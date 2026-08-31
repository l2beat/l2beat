import type { PrivacyAnonymitySetDepositSource } from '@l2beat/config'
import {
  assert,
  assertUnreachable,
  type EthereumAddress,
} from '@l2beat/shared-pure'
import type { PrivacyRpcLog } from '../types'
import { extractPrivacyFlow } from './extractPrivacyFlow'

export type PrivacyAnonymitySetDeposit = {
  amount: bigint
  origin: { type: 'event'; sender: EthereumAddress } | { type: 'transaction' }
}

export function extractPrivacyAnonymitySetDeposit(
  source: PrivacyAnonymitySetDepositSource,
  log: PrivacyRpcLog,
): PrivacyAnonymitySetDeposit | undefined {
  const result = extractPrivacyFlow(source, log)
  if (result === undefined) return undefined

  switch (source.extractor) {
    case 'privacyPoolsValue':
      assert(result.sender, 'Privacy Pools deposit is missing depositor')
      return {
        amount: result.amount,
        origin: { type: 'event', sender: result.sender },
      }
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
