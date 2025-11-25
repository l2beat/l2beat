import type { Transaction } from '../../../../utils/IEtherscanClient.js'
import type { IProvider } from '../../../provider/IProvider.js'

/**
 * https://eips.ethereum.org/EIPS/eip-4844#parameters
 */
const BLOB_TX_TYPE = 3

export async function checkForBlobs(
  provider: IProvider,
  sequencerTxs: Transaction[],
) {
  const rpcTxs = await Promise.all(
    sequencerTxs.map((tx) => provider.getTransaction(tx.hash)),
  )
  const missingIndex = rpcTxs.findIndex((x) => x === undefined)
  if (missingIndex !== -1) {
    throw new Error(
      `Transaction ${sequencerTxs[missingIndex]?.hash} is missing`,
    )
  }

  return (
    sequencerTxs.length > 0 && rpcTxs.some((tx) => tx?.type === BLOB_TX_TYPE)
  )
}
