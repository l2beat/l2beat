import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ScalingProjectPage as NextScalingProjectPage } from '~/app/(top-nav)/scaling/projects/[slug]/_page'
import { TopNavLayout } from '~/app/(top-nav)/top-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ProjectScalingEntry } from '~/server/features/scaling/project/get-scaling-project-entry'

interface Props extends AppLayoutProps {
  projectEntry: ProjectScalingEntry
  dehydratedState: DehydratedState
}

export function ScalingProjectPage({
  projectEntry,
  dehydratedState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={dehydratedState}>
        <TopNavLayout>
          <div className="smooth-scroll">
            <NextScalingProjectPage projectEntry={projectEntry} />
          </div>
        </TopNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
