import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { BridgesProjectPage as NextBridgesProjectPage } from '~/app/(top-nav)/bridges/projects/[slug]/_page'
import { TopNavLayout } from '~/app/(top-nav)/top-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { BridgesProjectEntry } from '~/server/features/bridges/project/get-bridges-project-entry'

interface Props extends AppLayoutProps {
  projectEntry: BridgesProjectEntry
  dehydratedState: DehydratedState
}

export function BridgesProjectPage({
  projectEntry,
  dehydratedState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={dehydratedState}>
        <TopNavLayout>
          <NextBridgesProjectPage projectEntry={projectEntry} />
        </TopNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
