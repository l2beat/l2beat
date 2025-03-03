import { celestiaTools } from '@l2beat/shared'
import type { Transaction } from '../../../../utils/IEtherscanClient'
import type { IProvider } from '../../../provider/IProvider'

export async function checkForCelestia(
  provider: IProvider,
  sequencerTxs: Transaction[],
) {
  const decodedCommitments = sequencerTxs
    .filter((tx) => celestiaTools.isOpStackCelestiaCommitment(tx.input))
    .map((tx) => celestiaTools.decodeCommitment(tx.input))

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
    throw new Error(`Multiple Celestia namespaces have been detected.`)
  }

  const requiredCount = sequencerTxs.length

  const verifiedCount = namespaces.filter(
    (namespace) => namespace !== undefined,
  ).length

  // check is in-direct, we simply check if we managed to align commitments with the same namespace
  return verifiedCount === requiredCount
}

async function getNamespaceFromCommitment(
  provider: IProvider,
  height: number,
  commitment: string,
) {
  const txs = await provider.raw(
    `celestia-txs-${height}`,
    ({ celestiaApiClient }) => {
      return celestiaApiClient.getDecodedTransactions(height)
    },
  )

  const possibleNamespaces = celestiaTools.extractNamespacesFromLogs(
    txs.map((tx) => tx.log),
  )

  for (const namespace of possibleNamespaces) {
    const blob = await provider.raw(
      `celestia-blob-${namespace}-${commitment}`,
      ({ celestiaApiClient }) => {
        return celestiaApiClient.getBlob(height, namespace, commitment)
      },
    )

    if (blob) {
      return namespace
    }
  }

  return undefined
}
