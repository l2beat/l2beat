import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import type { BridgesProjectEntry } from 'rewrite/src/server/features/bridges/project/get-bridges-project-entry'
import { BridgesProjectPage as NextBridgesProjectPage } from '~/app/(top-nav)/bridges/projects/[slug]/_page'
import { TopNavLayout } from '~/app/(top-nav)/top-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'

interface Props extends AppLayoutProps {
  projectEntry: BridgesProjectEntry
  queryState: DehydratedState
}

export function BridgesProjectPage({
  projectEntry,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <TopNavLayout>
          <NextBridgesProjectPage projectEntry={projectEntry} />
        </TopNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
