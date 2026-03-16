import type {
  AbstractTokenRecord,
  Database,
  InteropTransferRecord,
  TokenDatabase,
} from '@l2beat/database'
import { Address32, assert } from '@l2beat/shared-pure'
import { InteropTransferClassifier } from '../../../../../shared/build'

type TransferSuggestion = {
  chain: string
  address: string
  abstractToken: AbstractTokenRecord
  txs: {
    srcTxHash: string
    srcChain: string
    dstTxHash: string
    dstChain: string
    transferId: string
    plugin: string
  }[]
}

export async function getSuggestionsByPartialTransfers(
  db: Database,
  tokenDb: TokenDatabase,
): Promise<TransferSuggestion[]> {
  const [partialTransfers, abstractTokens] = await Promise.all([
    db.interopTransfer.getWithPartialAbstractTokenIds(),
    tokenDb.abstractToken.getAll(),
  ])
  const classifier = new InteropTransferClassifier()
  const classified = classifier.groupByBridgeType(partialTransfers)
  const transfersForSuggestions = [
    ...classified.lockAndMint,
    ...classified.burnAndMint,
  ]
  return buildTransferSuggestionMap(transfersForSuggestions, abstractTokens)
}

function buildTransferSuggestionMap(
  transfers: InteropTransferRecord[],
  abstractTokens: AbstractTokenRecord[],
): TransferSuggestion[] {
  const map = new Map<string, TransferSuggestion>()
  const abstractTokenMap = Object.fromEntries(
    abstractTokens.map((t) => [t.id, t]),
  )

  const txInfo = (t: InteropTransferRecord) => ({
    srcTxHash: t.srcTxHash,
    srcChain: t.srcChain,
    dstTxHash: t.dstTxHash,
    dstChain: t.dstChain,
    transferId: t.transferId,
    plugin: t.plugin,
  })

  const addSuggestion = (
    chain: string,
    tokenAddress: string,
    abstractTokenId: string,
    tx: ReturnType<typeof txInfo>,
  ) => {
    const key = `${chain}:${tokenAddress}:${abstractTokenId}`
    const abstractToken = abstractTokenMap[abstractTokenId]
    assert(abstractToken, 'abstractToken must be known here')

    const current = map.get(key)
    const address = Address32.cropToEthereumAddress(Address32(tokenAddress))
    if (current) {
      current.txs.push(tx)
    } else {
      map.set(key, {
        chain,
        address,
        abstractToken,
        txs: [tx],
      })
    }
  }

  for (const transfer of transfers) {
    if (!transfer.srcAbstractTokenId && transfer.srcTokenAddress) {
      assert(transfer.dstAbstractTokenId, 'dstAbstractTokenId is required')
      addSuggestion(
        transfer.srcChain,
        transfer.srcTokenAddress,
        transfer.dstAbstractTokenId,
        txInfo(transfer),
      )
    }
    if (!transfer.dstAbstractTokenId && transfer.dstTokenAddress) {
      assert(transfer.srcAbstractTokenId, 'srcAbstractTokenId is required')
      addSuggestion(
        transfer.dstChain,
        transfer.dstTokenAddress,
        transfer.srcAbstractTokenId,
        txInfo(transfer),
      )
    }
  }

  return Array.from(map.values())
}
