import {} from '@radix-ui/react-accordion'
import { MainPageHeader } from '~/components/MainPageHeader'
import { CustomLink } from '~/components/link/CustomLink'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { InfoIcon } from '~/icons/Info'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout.tsx'
import { SideNavLayout } from '~/layouts/SideNavLayout'

interface Props extends AppLayoutProps {}

export function ZkCatalogPage({ ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>ZK Catalog</MainPageHeader>
        <div className="mt-[20vh] flex flex-col items-center gap-2 md:mt-[10%]">
          <PrimaryCard className="bg-yellow-200/10 shadow-sm md:w-3/4 md:border-2 md:border-warning">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-warning text-xl xs:text-2xl">
              <InfoIcon className="size-5 xs:size-6 fill-current" />
              <span>ZK Catalog rework in progress</span>
            </h2>
            <p className="mb-4">
              We are in the process of reworking the ZK Catalog to provide you
              with better insights and more comprehensive data about
              zero-knowledge solutions.
            </p>
            <p>
              Previous version can be found here:{' '}
              <CustomLink href="/zk-catalog/v1">ZK Catalog V1</CustomLink>
            </p>
          </PrimaryCard>
          <p className="text-balance px-6 text-center text-secondary text-sm">
            We appreciate your patience as we work to improve your experience.
          </p>
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}
