import { celestiaTools } from '@l2beat/shared'
import type { Transaction } from '../../../../utils/IEtherscanClient'

export function checkForCelestia(sequencerTxs: Transaction[]) {
  const celestiaCommitments = sequencerTxs.filter((tx) =>
    celestiaTools.isOpStackCelestiaCommitment(tx.input),
  )

  // fallbacks are ignored here
  const decodedCommitments = celestiaCommitments.map((tx) =>
    celestiaTools.decodeCommitment(tx.input),
  )

  if (decodedCommitments.length === 0) {
    return false
  }

  const requiredCount = celestiaCommitments.length
  const decodedCount = decodedCommitments.length

  return decodedCount === requiredCount
}
