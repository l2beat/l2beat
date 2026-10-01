import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { OssificationEntry } from '~/server/features/projects/ossification/getOssificationEntries'
import { OssificationTable } from './components/table/OssificationTable'

interface Props extends AppLayoutProps {
  entries: OssificationEntry[]
}

export function OssificationPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Ossification measures how battle-tested the code securing a project is: the share of recorded code-bug exploits (published, onchain-verified dataset) whose exploited code was younger than the project's critical contracts are today. Any deployment or critical change to those contracts resets the clock. Battle-tested exposure is the value they secured over the unchanged period.">
          Ossification
        </MainPageHeader>
        <OssificationTable entries={entries} />
      </SideNavLayout>
    </AppLayout>
  )
}
