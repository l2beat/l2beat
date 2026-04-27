import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { useState } from 'react'
import type { TokenData } from '~/server/features/scaling/interop/types'
import type { TopItems } from '~/server/features/scaling/interop/utils/getTopItems'
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { InteropTopItems } from '../top-items/TopItems'
import { TokensDialog } from './TokensDialog'

export function TopTokensCell({
  topItems,
  type,
  protocol,
  showNetMintedValueColumn,
}: {
  topItems: TopItems<TokenData>
  type: KnownInteropBridgeType | undefined
  protocol: {
    id: ProjectId
    name: string
    iconUrl: string
    bridgeTypes?: KnownInteropBridgeType[]
  }
  showNetMintedValueColumn?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const utils = api.useUtils()
  const { selectionForApi } = useInteropSelectedChains()

  return (
    <>
      <InteropTopItems
        topItems={{
          items: topItems.items.map((token) => ({
            ...token,
            displayName: token.symbol,
          })),
          remainingCount: topItems.remainingCount,
        }}
        onMouseEnter={() =>
          utils.interop.tokens.prefetch({
            ...selectionForApi,
            id: protocol.id,
            type,
          })
        }
        type="cell"
        setIsOpen={setIsOpen}
      />
      <TokensDialog
        id={protocol.id}
        type={type}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={
          <>
            <span>Top tokens & pairs by volume for </span>
            <img
              src={protocol.iconUrl}
              alt={protocol.name}
              className="relative bottom-px mx-1 inline-block size-6"
            />
            <span>{protocol.name}</span>
          </>
        }
        showNetMintedValueColumn={showNetMintedValueColumn}
      />
    </>
  )
}
