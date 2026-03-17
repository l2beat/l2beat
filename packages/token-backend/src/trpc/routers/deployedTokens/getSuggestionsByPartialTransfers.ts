import type {
  AbstractTokenRecord,
  Database,
  DeployedTokenRecord,
  InteropTransferRecord,
  TokenDatabase,
} from '@l2beat/database'
import { Address32, assert } from '@l2beat/shared-pure'
import { InteropTransferClassifier } from '../../../../../shared/build'
import type { ChainRecord } from '../../../schemas/Chain'

type TransferSuggestion = {
  chain: string
  address: string
  explorerUrl: string | undefined
  abstractToken: AbstractTokenRecord
  txs: {
    srcTxHash: string
    srcChain: string
    srcExplorerUrl: string | undefined
    dstTxHash: string
    dstChain: string
    dstExplorerUrl: string | undefined
    transferId: string
    plugin: string
  }[]
}

export async function getSuggestionsByPartialTransfers(
  db: Database,
  tokenDb: TokenDatabase,
): Promise<TransferSuggestion[]> {
  const [partialTransfers, abstractTokens, deployedTokens, chains] =
    await Promise.all([
      db.interopTransfer.getWithPartialAbstractTokenIds(),
      tokenDb.abstractToken.getAll(),
      tokenDb.deployedToken.getAll(),
      tokenDb.chain.getAll(),
    ])
  const classifier = new InteropTransferClassifier()
  const classified = classifier.groupByBridgeType(partialTransfers)
  const transfersForSuggestions = [
    ...classified.lockAndMint,
    ...classified.burnAndMint,
  ]
  return buildTransferSuggestionMap(
    transfersForSuggestions,
    abstractTokens,
    deployedTokens,
    chains,
  )
}

function buildTransferSuggestionMap(
  transfers: InteropTransferRecord[],
  abstractTokens: AbstractTokenRecord[],
  deployedTokens: DeployedTokenRecord[],
  chains: ChainRecord[],
): TransferSuggestion[] {
  const map = new Map<string, TransferSuggestion>()
  const abstractTokenMap = Object.fromEntries(
    abstractTokens.map((t) => [t.id, t]),
  )
  const deployedTokenMap = Object.fromEntries(
    deployedTokens.map((t) => [`${t.chain}:${t.address.toLowerCase()}`, t]),
  )
  const chainMap = Object.fromEntries(chains.map((c) => [c.name, c]))
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
    const key = `${chain}:${tokenAddress.toLowerCase()}:${abstractTokenId}`
    const abstractToken = abstractTokenMap[abstractTokenId]
    if (!abstractToken) {
      return
    }

    const ethereumAddress = Address32.cropToEthereumAddress(
      Address32(tokenAddress),
    )
    const deployedToken =
      deployedTokenMap[`${chain}:${ethereumAddress.toLowerCase()}`]

    if (deployedToken) {
      return
    }

    const current = map.get(key)
    if (current) {
      current.txs.push({
        ...tx,
        srcExplorerUrl: chainMap[tx.srcChain]?.explorerUrl ?? undefined,
        dstExplorerUrl: chainMap[tx.dstChain]?.explorerUrl ?? undefined,
      })
    } else {
      map.set(key, {
        chain,
        address: ethereumAddress,
        explorerUrl: chainMap[chain]?.explorerUrl ?? undefined,
        abstractToken,
        txs: [
          {
            ...tx,
            srcExplorerUrl: chainMap[tx.srcChain]?.explorerUrl ?? undefined,
            dstExplorerUrl: chainMap[tx.dstChain]?.explorerUrl ?? undefined,
          },
        ],
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
