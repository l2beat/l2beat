import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { type ReactNode, useState } from 'react'
import { Checkbox } from '~/components/core/Checkbox'
import {
  Dialog,
  DialogClose,
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
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import type { InteropSelection } from '../../utils/types'
import { BetweenChainsInfo } from '../BetweenChainsInfo'
import { TokensPairsTable } from './TokenPairsTable'
import { type TokensQueryInput, TokensTable } from './TokensTable'

type ActiveTab = 'tokens' | 'pairs'

interface TokensDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  queryInput: TokensQueryInput
  title: ReactNode
  subtitle?: ReactNode
  showNetMintedValueColumn?: boolean
  showFlowsColumn?: boolean
}

export function TokensDialog({
  isOpen,
  setIsOpen,
  queryInput,
  title,
  subtitle,
  showNetMintedValueColumn,
  showFlowsColumn,
}: TokensDialogProps) {
  const breakpoint = useBreakpoint()
  const [activeTab, setActiveTab] = useState<ActiveTab>('tokens')
  const [hideSameToken, setHideSameToken] = useState(false)

  const showTopProtocolColumn = queryInput.id === undefined

  const tabsList = (
    <>
      <TabsList>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
        <TabsTrigger value="pairs">Pairs</TabsTrigger>
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
          showTopProtocolColumn={showTopProtocolColumn}
          showFlowsColumn={showFlowsColumn}
        />
      </TabsContent>
      <TabsContent value="pairs">
        <TokensPairsTable
          queryInput={queryInput}
          hideSameToken={hideSameToken}
          showTopProtocolColumn={showTopProtocolColumn}
          showFlowsColumn={showFlowsColumn}
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
              {subtitle}
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
      <DialogContent className="primary-card flex max-h-3/5 w-[1120px] max-w-[calc(100vw-1rem)] flex-col gap-0 overflow-hidden bg-surface-primary px-0 pt-0 pb-0">
        <DialogClose />
        <Tabs
          name="tokens"
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ActiveTab)}
          variant="highlighted"
          className="flex min-h-0 flex-1 flex-col"
        >
          <DialogHeader className="fade-out-to-bottom-3 -mb-2 relative z-20 shrink-0 bg-surface-primary px-6 pt-6 pb-3">
            <DialogTitle>{title}</DialogTitle>
            {subtitle}
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

export function SelectedChainsTokensDialog({
  id,
  type,
  isOpen,
  setIsOpen,
  apiSelection,
  title,
  showNetMintedValueColumn,
  showFlowsColumn,
}: Omit<TokensDialogProps, 'queryInput' | 'subtitle'> & {
  id: ProjectId | undefined
  type?: KnownInteropBridgeType
  apiSelection?: InteropSelection
}) {
  const { selectionForApi } = useInteropSelectedChains()

  return (
    <TokensDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      queryInput={{ ...(apiSelection ?? selectionForApi), id, type }}
      title={title}
      subtitle={<BetweenChainsInfo className="mt-1" />}
      showNetMintedValueColumn={showNetMintedValueColumn}
      showFlowsColumn={showFlowsColumn}
    />
  )
}
