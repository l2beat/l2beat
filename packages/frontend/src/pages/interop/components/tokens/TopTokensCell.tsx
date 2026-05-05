import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { useState } from 'react'
import type { TokenData } from '~/server/features/scaling/interop/types'
import type { TopItems } from '~/server/features/scaling/interop/utils/getTopItems'
import { api } from '~/trpc/React'
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
    iconUrl: string
    bridgeTypes?: KnownInteropBridgeType[]
  }
  apiSelection: InteropSelection
  hideDialog?: boolean
  showNetMintedValueColumn?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const utils = api.useUtils()

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
        onMouseEnter={
          hideDialog
            ? undefined
            : () =>
                utils.interop.tokens.prefetch({
                  ...apiSelection,
                  id: protocol.id,
                  type,
                })
        }
        type="cell"
        setIsOpen={setIsOpen}
        hideDialog={hideDialog}
      />
      {!hideDialog && (
        <TokensDialog
          id={protocol.id}
          type={type}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          apiSelection={apiSelection}
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
      )}
    </>
  )
}
