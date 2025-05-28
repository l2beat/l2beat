import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import type { ProjectScalingEntry } from 'rewrite/src/server/features/scaling/project/get-scaling-project-entry'
import { ScalingProjectPage as NextScalingProjectPage } from '~/app/(top-nav)/scaling/projects/[slug]/_page'
import { TopNavLayout } from '~/app/(top-nav)/top-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'

interface Props extends AppLayoutProps {
  projectEntry: ProjectScalingEntry
  queryState: DehydratedState
}

export function ScalingProjectPage({
  projectEntry,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <TopNavLayout>
          <div className="smooth-scroll">
            <NextScalingProjectPage projectEntry={projectEntry} />
          </div>
        </TopNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
