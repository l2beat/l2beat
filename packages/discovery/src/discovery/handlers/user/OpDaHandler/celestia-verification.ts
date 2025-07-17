import { celestiaTools } from '@l2beat/shared'
import type { Transaction } from '../../../../utils/IEtherscanClient'
import type { IProvider } from '../../../provider/IProvider'

export async function checkForCelestia(
  provider: IProvider,
  sequencerTxs: Transaction[],
) {
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

  const namespaces = await Promise.all(
    decodedCommitments.map((commitment) =>
      getNamespaceFromCommitment(
        provider,
        commitment.blockHeight,
        commitment.blobCommitment,
      ),
    ),
  )

  // check if we have single namespace
  if (new Set(namespaces).size !== 1) {
    throw new Error('Multiple Celestia namespaces have been detected.')
  }

  const requiredCount = celestiaCommitments.length

  const verifiedCount = namespaces.filter(
    (namespace) => namespace !== undefined,
  ).length

  // check is in-direct, we simply check if we managed to align commitments with the same namespace
  return verifiedCount === requiredCount
}

export async function getNamespaceFromCommitment(
  provider: IProvider,
  height: number,
  commitment: string,
) {
  const logs = await provider.getCelestiaBlockResultLogs(height)

  const possibleNamespaces = celestiaTools.extractNamespacesFromLogs(logs)

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
