import { unique } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'
import type {
  CommonInteropData,
  InteropProtocolTokensParams,
  TokenData,
} from './types'
import { accumulateTokens } from './utils/accumulate'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { buildTransfersTimeModeMap } from './utils/buildTransfersTimeModeMap'
import { buildDurationSplitMap } from './utils/getAverageDuration'
import {
  getDirection,
  INITIAL_COMMON_INTEROP_DATA,
} from './utils/getProtocolsDataMap'
import { getTokensData } from './utils/getTokensData'
import {
  filterDirectionalTokens,
  filterDirectionalTransfers,
  resolveInteropSelection,
  toLegacySelectedChainsTuple,
} from './utils/resolveInteropSelection'

export async function getInteropProtocolTokens({
  id,
  from,
  to,
  type,
}: InteropProtocolTokensParams): Promise<TokenData[]> {
  const logger = getLogger().for('getProtocolTokens')
  const db = getDb()

  const selection = resolveInteropSelection({ from, to })
  if (selection.mode === 'empty') {
    return []
  }

  const interopProject = await ps.getProject({
    id,
    select: ['interopConfig'],
  })
  if (!interopProject) {
    return []
  }

  const latestTimestamp =
    await db.aggregatedInteropTransfer.getLatestTimestamp()
  if (!latestTimestamp) {
    return []
  }

  const selectedChains = toLegacySelectedChainsTuple(selection.union)

  const [counts, tokens] =
    selection.mode === 'pair'
      ? await Promise.all([
          db.aggregatedInteropTransfer.getSummedTransferCountsByChainsIdAndTimestamp(
            latestTimestamp,
            id,
            selectedChains,
            type,
          ),
          db.aggregatedInteropToken.getByChainsIdAndTimestamp(
            latestTimestamp,
            id,
            selectedChains,
            type,
          ),
        ])
      : await Promise.all([
          db.aggregatedInteropTransfer
            .getByChainsIdAndTimestamp(
              latestTimestamp,
              id,
              selectedChains,
              type,
            )
            .then((transfers) => {
              const filteredTransfers = filterDirectionalTransfers(
                transfers,
                selection.from,
                selection.to,
              )
              return {
                transferCount: filteredTransfers.reduce(
                  (acc, transfer) => acc + transfer.transferCount,
                  0,
                ),
                identifiedCount: filteredTransfers.reduce(
                  (acc, transfer) => acc + transfer.identifiedCount,
                  0,
                ),
              }
            }),
          db.aggregatedInteropToken
            .getByChainsIdAndTimestamp(
              latestTimestamp,
              id,
              selectedChains,
              type,
            )
            .then((allTokens) =>
              filterDirectionalTokens(allTokens, selection.from, selection.to),
            ),
        ])

  const abstractTokenIds = unique(tokens.map((token) => token.abstractTokenId))
  const transfersTimeModeMap = buildTransfersTimeModeMap([interopProject])
  const tokensDetailsMap = await buildTokensDetailsMap(abstractTokenIds)
  const durationSplitMap = buildDurationSplitMap([interopProject])

  const result: Map<string, CommonInteropData> = new Map()
  for (const token of tokens) {
    const current =
      result.get(token.abstractTokenId) ?? INITIAL_COMMON_INTEROP_DATA

    const transfersTimeMode = transfersTimeModeMap.get(interopProject.id)
    const durationSplit =
      token.bridgeType !== 'unknown'
        ? durationSplitMap?.get(interopProject.id)?.get(token.bridgeType)
        : undefined
    const direction = getDirection(token, durationSplit, transfersTimeMode)

    result.set(
      token.abstractTokenId,
      accumulateTokens(current, token, direction),
    )
  }

  return getTokensData({
    projectId: id,
    bridgeType: type,
    tokens: result,
    tokensDetailsMap,
    durationSplitMap,
    unknownTransfersCount: counts.transferCount - counts.identifiedCount,
    logger,
  })
}
