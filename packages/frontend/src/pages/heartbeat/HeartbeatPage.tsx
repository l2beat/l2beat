import { MainPageHeader } from '~/components/MainPageHeader'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { HeartbeatProject } from '~/server/features/heartbeat/getHeartbeatProjects'
import { HeartbeatMonitor } from './components/HeartbeatMonitor'

interface Props extends AppLayoutProps {
  projects: HeartbeatProject[]
}

export function HeartbeatPage({ projects, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Every chain's pulse, block by block. Each beat is a second with a block, as tall as its transactions.">
          Heartbeat
        </MainPageHeader>
        <HeartbeatMonitor projects={projects} />
      </SideNavLayout>
    </AppLayout>
  )
}
