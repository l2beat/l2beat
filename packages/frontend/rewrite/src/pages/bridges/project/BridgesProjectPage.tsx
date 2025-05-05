import { BridgesProjectPage as NextBridgesProjectPage } from '~/app/(top-nav)/bridges/projects/[slug]/_page'
import { TopNavLayout } from '~/app/(top-nav)/top-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { BridgesProjectEntry } from '~/server/features/bridges/project/get-bridges-project-entry'

interface Props extends AppLayoutProps {
  projectEntry: BridgesProjectEntry
}

export function BridgesProjectPage({ projectEntry, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <TopNavLayout>
        <NextBridgesProjectPage projectEntry={projectEntry} />
      </TopNavLayout>
    </AppLayout>
  )
}
