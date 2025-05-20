import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { EcosystemProjectPage as NextEcosystemProjectPage } from '~/app/(side-nav)/ecosystems/[slug]/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { EcosystemEntry } from '~/server/features/ecosystems/get-ecosystem-entry'
interface Props extends AppLayoutProps {
  ecosystem: EcosystemEntry
  dehydratedState: DehydratedState
}

export function EcosystemProjectPage({
  ecosystem,
  dehydratedState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={dehydratedState}>
        <SideNavLayout>
          <NextEcosystemProjectPage ecosystem={ecosystem} />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
