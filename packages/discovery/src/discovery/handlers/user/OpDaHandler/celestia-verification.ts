import { celestiaTools } from '@l2beat/shared'
import type { Transaction } from '../../../../utils/IEtherscanClient'
import type { IProvider } from '../../../provider/IProvider'

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

export async function getNamespaceFromCommitment(
  provider: IProvider,
  height: number,
  commitment: string,
) {
  const events = await provider.getCelestiaBlockResultEvents(height)

  const possibleNamespaces = celestiaTools.extractNamespacesFromEvents(events)

  for (const namespace of possibleNamespaces) {
    const blobExists = await provider.celestiaBlobExists(
      height,
      namespace,
      commitment,
    )

    if (blobExists) {
      return namespace
    }
  }

  return undefined
}
