import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { useState } from 'react'
import type { TokenData } from '~/server/features/scaling/interop/types'
import type { TopItems } from '~/server/features/scaling/interop/utils/getTopItems'
import { getInteropTokenUrl } from '../../utils/getInteropTokenUrl'
import type { InteropSelection } from '../../utils/types'
import { InteropTopItems } from '../top-items/TopItems'
import { TokensDialog } from './TokensDialog'

export function TopTokensCell({
  topItems,
  type,
  protocol,
  apiSelection,
  hideDialog,
  showNetMintedValueColumn,
}: {
  topItems: TopItems<TokenData>
  type: KnownInteropBridgeType | undefined
  protocol: {
    id: ProjectId
    name: string
    slug: string
    iconUrl: string
    bridgeTypes?: KnownInteropBridgeType[]
  }
  apiSelection: InteropSelection
  hideDialog?: boolean
  showNetMintedValueColumn?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <InteropTopItems
        topItems={{
          items: topItems.items.map((token) => ({
            ...token,
            displayName: token.symbol,
            href: hideDialog
              ? getInteropTokenUrl(token, apiSelection)
              : undefined,
          })),
          remainingCount: topItems.remainingCount,
        }}
        type="cell"
        {...(hideDialog
          ? { hideDialog: true as const }
          : { hideDialog: false as const, setIsOpen })}
      />
      {!hideDialog && (
        <TokensDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          queryInput={{ ...apiSelection, id: protocol.id, type }}
          title={
            <>
              <span>Top tokens & pairs by volume for </span>
              <a href={`/interop/protocols/${protocol.slug}`}>
                <img
                  src={protocol.iconUrl}
                  alt={protocol.name}
                  className="relative bottom-px mx-1 inline-block size-6"
                />
                <span>{protocol.name}</span>
              </a>
            </>
          }
          showNetMintedValueColumn={showNetMintedValueColumn}
        />
      )}
    </>
  )
}
