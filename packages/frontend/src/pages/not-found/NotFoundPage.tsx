import { Button } from '~/components/core/Button'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PlainLink } from '~/components/PlainLink'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { env } from '~/env'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'

const HOME_LINK = env.CLIENT_SIDE_HOME_PAGE ? '/' : '/layer2s/summary'

export function NotFoundPage(props: AppLayoutProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Page not found</MainPageHeader>
        <PrimaryCard className="flex grow flex-col items-center justify-center gap-6 py-16 text-center max-md:bg-transparent">
          <p className="font-bold text-[80px] text-brand leading-none">404</p>
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-2xl">This page doesn't exist</h2>
            <p className="text-secondary text-sm">
              The page you are looking for was moved, removed or never existed.
            </p>
          </div>
          <Button variant="fill" asChild>
            <PlainLink href={HOME_LINK}>Go to main page</PlainLink>
          </Button>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}
