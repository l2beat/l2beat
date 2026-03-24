import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { useState } from 'react'
import type { TokenData } from '~/server/features/scaling/interop/types'
import type { TopItems } from '~/server/features/scaling/interop/utils/getTopItems'
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { TokenTableDialog } from './TokenTableDialog'
import { InteropTopItems } from './TopItems'

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

  const resolvedType =
    type ??
    (protocol.bridgeTypes?.length === 1 ? protocol.bridgeTypes[0] : undefined)

  return (
    <>
      <InteropTopItems
        topItems={{
          items: topItems.items.map((token) => ({
            id: token.id,
            displayName: token.symbol,
            iconUrl: token.iconUrl,
            volume: token.volume,
            issuer: token.issuer,
            transferCount: token.transferCount,
            avgDuration: token.avgDuration,
            avgValue: token.avgValue,
            minTransferValueUsd: token.minTransferValueUsd,
            maxTransferValueUsd: token.maxTransferValueUsd,
            netMintedValue: token.netMintedValue,
          })),
          remainingCount: topItems.remainingCount,
        }}
        onMouseEnter={() =>
          utils.interop.tokens.prefetch({
            ...selectionForApi,
            id: protocol.id,
            type: resolvedType,
          })
        }
        type="cell"
        setIsOpen={setIsOpen}
      />
      <TopTokensContent
        type={resolvedType}
        protocol={protocol}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        showNetMintedValueColumn={showNetMintedValueColumn}
      />
    </>
  )
}

function TopTokensContent({
  type,
  protocol,
  isOpen,
  setIsOpen,
  showNetMintedValueColumn,
}: {
  type: KnownInteropBridgeType | undefined
  protocol: { id: ProjectId; name: string; iconUrl: string }
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  showNetMintedValueColumn?: boolean
}) {
  const { selectionForApi } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.tokens.useQuery(
    {
      ...selectionForApi,
      id: protocol.id,
      type,
    },
    {
      enabled: isOpen,
    },
  )

  return (
    <TokenTableDialog
      data={data}
      isLoading={isLoading}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={
        <>
          <span>Top tokens by volume for </span>
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
  )
}
