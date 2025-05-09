import { ScalingProjectPage as NextScalingProjectPage } from '~/app/(top-nav)/scaling/projects/[slug]/_page'
import { TopNavLayout } from '~/app/(top-nav)/top-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { ProjectScalingEntry } from '~/server/features/scaling/project/get-scaling-project-entry'

interface Props extends AppLayoutProps {
  projectEntry: ProjectScalingEntry
}

export function ScalingProjectPage({ projectEntry, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <TopNavLayout>
        <div className="smooth-scroll">
          <NextScalingProjectPage projectEntry={projectEntry} />
        </div>
      </TopNavLayout>
    </AppLayout>
  )
}
