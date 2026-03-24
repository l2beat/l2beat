import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/core/Dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '~/components/core/Drawer'
import { Tabs, TabsList, TabsTrigger } from '~/components/core/Tabs'
import { BasicTable } from '~/components/table/BasicTable'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import type { TokenData } from '~/server/features/scaling/interop/types'
import type { TopItems } from '~/server/features/scaling/interop/utils/getTopItems'
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { BetweenChainsInfo } from '../BetweenChainsInfo'
import { getTopTokensColumns } from './columns'
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
            ...token,
            displayName: token.symbol,
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

type ActiveTab = 'tokens' | 'pairs'

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
<<<<<<< HEAD
  const breakpoint = useBreakpoint()
  const utils = api.useUtils()
=======
>>>>>>> main
  const { selectionForApi } = useInteropSelectedChains()
  const [activeTab, setActiveTab] = useState<ActiveTab>('tokens')

  const queryInput = {
    ...selectionForApi,
    id: protocol.id,
    type,
  }

  const { data: tokensData, isLoading: isTokensLoading } =
    api.interop.tokens.useQuery(queryInput, {
      enabled: isOpen,
    })

  const { data: pairsData, isLoading: isPairsLoading } =
    api.interop.pairs.useQuery(queryInput, {
      enabled: isOpen && activeTab === 'pairs',
    })

  const tokensColumns = useMemo(
    () => getTopTokensColumns(showNetMintedValueColumn),
    [showNetMintedValueColumn],
  )

<<<<<<< HEAD
  const tokensTable = useTable<TokenRow>({
    data: tokensData ?? [],
    columns: tokensColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      columnPinning: {
        left: ['icon'],
      },
      sorting: [
        {
          id: 'volume',
          desc: true,
        },
      ],
    },
  })

  const pairsTable = useTable<PairRow>({
    data: pairsData ?? [],
    columns: topPairsColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: 'volume',
          desc: true,
        },
      ],
    },
  })

  const tabs = (
    <Tabs
      value={activeTab}
      onValueChange={(val) => setActiveTab(val as ActiveTab)}
      variant="highlighted"
      name="topItems"
    >
      <TabsList>
        <TabsTrigger value="tokens">Top tokens</TabsTrigger>
        <TabsTrigger
          value="pairs"
          onMouseEnter={() => utils.interop.pairs.prefetch(queryInput)}
        >
          Top pairs
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )

  if (breakpoint === 'xs' || breakpoint === 'sm') {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader className="mb-2">
            <DrawerTitle className="mb-0 text-xl">
              <span>Top items by volume for </span>
              <img
                src={protocol.iconUrl}
                alt={protocol.name}
                className="relative bottom-px mx-1 inline-block size-6"
              />
              <span>{protocol.name}</span>
            </DrawerTitle>
            <BetweenChainsInfo />
            <div className="mt-2">{tabs}</div>
          </DrawerHeader>
          <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden">
            {activeTab === 'tokens' ? (
              <BasicTable
                skeletonCount={6}
                table={tokensTable}
                tableWrapperClassName="pb-0"
                isLoading={isTokensLoading}
              />
            ) : (
              <BasicTable
                skeletonCount={6}
                table={pairsTable}
                tableWrapperClassName="pb-0"
                isLoading={isPairsLoading}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[450px] w-max max-w-[calc(100vw-1rem)] gap-0 overflow-y-auto bg-surface-primary px-0 pt-0 pb-3">
        <DialogHeader className="fade-out-to-bottom-3 sticky top-0 z-20 bg-surface-primary px-6 pt-6 pb-4">
          <DialogTitle>
            <span>Top items by volume for </span>
            <img
              src={protocol.iconUrl}
              alt={protocol.name}
              className="relative bottom-0.5 mx-1 inline-block size-6"
            />
            <span>{protocol.name}</span>
          </DialogTitle>
          <BetweenChainsInfo className="mt-1" />
          <div className="mt-2">{tabs}</div>
        </DialogHeader>
        <div className="overflow-x-auto">
          <div className="mx-6">
            {activeTab === 'tokens' ? (
              <BasicTable
                skeletonCount={6}
                table={tokensTable}
                tableWrapperClassName="pb-0"
                isLoading={isTokensLoading}
              />
            ) : (
              <BasicTable
                skeletonCount={6}
                table={pairsTable}
                tableWrapperClassName="pb-0"
                isLoading={isPairsLoading}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
=======
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
>>>>>>> main
  )
}
