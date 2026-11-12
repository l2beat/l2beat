import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { EthereumHeadProvider } from './live/EthereumHeadContext'
import { VariantSwitcher } from './VariantSwitcher'
import type { VariantId } from './variants/registry'
import type { VariantProps } from './variants/types'
import { Variant } from './variants/Variant'

interface Props extends AppLayoutProps, VariantProps {
  variant: VariantId
  speed: number
  queryState: DehydratedState
}

export function EthereumPage({
  variant,
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
            <Variant
              id={variant}
              entry={entry}
              posters={posters}
              historyEnd={historyEnd}
            />
            {/* keeps the last section clear of the switcher */}
            <div className="h-24" />
          </SideNavLayout>
          <VariantSwitcher current={variant} speed={speed} />
        </EthereumHeadProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}
