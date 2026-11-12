import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import {
  EthereumPageContent,
  type EthereumPageContentProps,
} from './EthereumPageContent'
import { EthereumHeadProvider } from './live/EthereumHeadContext'
import { PrototypeControls } from './PrototypeControls'

interface Props extends AppLayoutProps, EthereumPageContentProps {
  speed: number
  queryState: DehydratedState
}

export function EthereumPage({
  speed,
  queryState,
  entry,
  posters,
  historyEnd,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <EthereumHeadProvider posters={posters} speed={speed}>
          <SideNavLayout>
            <EthereumPageContent
              entry={entry}
              posters={posters}
              historyEnd={historyEnd}
            />
            {/* keeps the last section clear of the prototype controls */}
            <div className="h-24" />
          </SideNavLayout>
          <PrototypeControls speed={speed} />
        </EthereumHeadProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}
