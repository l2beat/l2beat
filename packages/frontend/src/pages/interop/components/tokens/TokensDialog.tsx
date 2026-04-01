import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { type ReactNode, useState } from 'react'
import { Checkbox } from '~/components/core/Checkbox'
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { BetweenChainsInfo } from '../BetweenChainsInfo'
import { TokensPairsTable } from './TokenPairsTable'
import { TokensTable } from './TokensTable'

type ActiveTab = 'tokens' | 'pairs'

interface TokensDialogProps {
  id: ProjectId | undefined
  type?: KnownInteropBridgeType
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  title: ReactNode
  showNetMintedValueColumn?: boolean
}

export function TokensDialog({
  id,
  type,
  isOpen,
  setIsOpen,
  title,
  showNetMintedValueColumn,
}: TokensDialogProps) {
  const breakpoint = useBreakpoint()
  const { selectionForApi } = useInteropSelectedChains()
  const [activeTab, setActiveTab] = useState<ActiveTab>('tokens')
  const [hideSameToken, setHideSameToken] = useState(false)

  const utils = api.useUtils()
  const queryInput = { ...selectionForApi, id, type }

  const tabsList = (
    <>
      <TabsList>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
        <TabsTrigger
          value="pairs"
          onMouseEnter={() => utils.interop.tokensPairs.prefetch(queryInput)}
        >
          Pairs
        </TabsTrigger>
      </TabsList>
      {activeTab === 'pairs' && (
        <Checkbox
          name="hide-same-token-pairs"
          checked={hideSameToken}
          onCheckedChange={(checked) => setHideSameToken(checked === true)}
        >
          Hide pairs with same token
        </Checkbox>
      )}
    </>
  )

  const tabsContent = (
    <>
      <TabsContent value="tokens">
        <TokensTable
          queryInput={queryInput}
          showNetMintedValueColumn={showNetMintedValueColumn}
        />
      </TabsContent>
      <TabsContent value="pairs">
        <TokensPairsTable
          queryInput={queryInput}
          hideSameToken={hideSameToken}
        />
      </TabsContent>
    </>
  )

  if (breakpoint === 'xs' || breakpoint === 'sm') {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <Tabs
            name="tokens"
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as ActiveTab)}
            variant="highlighted"
          >
            <DrawerHeader className="mb-2">
              <DrawerTitle className="mb-0 text-xl">{title}</DrawerTitle>
              <BetweenChainsInfo />
              {tabsList}
            </DrawerHeader>
            <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden">
              {tabsContent}
            </div>
          </Tabs>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="primary-card flex max-h-3/5 w-[1040px] max-w-[calc(100vw-1rem)] flex-col gap-0 overflow-hidden bg-surface-primary px-0 pt-0 pb-0">
        <Tabs
          name="tokens"
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ActiveTab)}
          variant="highlighted"
          className="flex min-h-0 flex-1 flex-col"
        >
          <DialogHeader className="fade-out-to-bottom-3 -mb-2 relative z-20 shrink-0 bg-surface-primary px-6 pt-6 pb-3">
            <DialogTitle>{title}</DialogTitle>
            <BetweenChainsInfo className="mt-1" />
            {tabsList}
          </DialogHeader>
          <div className="-mt-4 flex-1 overflow-x-auto overflow-y-auto pt-4">
            <div className="mx-6 pb-3">{tabsContent}</div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
