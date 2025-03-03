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

  const requiredCount = sequencerTxs.length

  let verifiedCount = 0

  for (const commitment of decodedCommitments) {
    // This is in-direct verification;
    // this means that if we found a namespace, sequencer is sending OpStack Celestia commitments
    const namespace = await getNamespaceFromCommitment(
      provider,
      commitment.blockHeight,
      commitment.blobCommitment,
    )
    console.log(`Namespace: ${namespace}`)
    if (namespace) {
      verifiedCount++
    }
  }

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
