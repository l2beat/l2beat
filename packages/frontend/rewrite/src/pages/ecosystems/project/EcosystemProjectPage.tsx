import { EcosystemProjectPage as NextEcosystemProjectPage } from '~/app/(side-nav)/ecosystems/[slug]/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'
import type { EcosystemEntry } from '~/server/features/ecosystems/get-ecosystem-entry'

interface Props extends AppLayoutProps {
  ecosystem: EcosystemEntry
}

export function EcosystemProjectPage({ ecosystem, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextEcosystemProjectPage ecosystem={ecosystem} />
      </SideNavLayout>
    </AppLayout>
  )
}
