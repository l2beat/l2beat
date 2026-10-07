import { CustomLink } from '~/components/link/CustomLink'
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
        <MainPageHeader description={<OssificationDescription />}>
          Ossification
        </MainPageHeader>
        <OssificationTable entries={entries} />
      </SideNavLayout>
    </AppLayout>
  )
}

function OssificationDescription() {
  return (
    <>
      Ossification measures how battle-tested the code securing a project is:
      the share of recorded code-bug exploits (
      <CustomLink href="https://github.com/l2beat/ossification-dataset">
        published, onchain-verified dataset
      </CustomLink>
      ) whose exploited code was younger than the project's critical contracts
      are today. The clock starts at the launch, and every critical change or
      new critical contract after it resets the clock. Battle-tested exposure is
      the value they secured over the unchanged period.
    </>
  )
}
