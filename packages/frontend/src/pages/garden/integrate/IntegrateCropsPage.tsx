import { MainPageHeader } from '~/components/MainPageHeader'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { GARDEN_ANIMATIONS_CSS, GARDEN_SURFACES_CSS } from '../gardenCss'

/** Intentionally empty for now - the integration story is still being written. */
export function IntegrateCropsPage(props: AppLayoutProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <style>{PAGE_CSS}</style>
        <div className="relative flex grow flex-col pb-24">
          <h1 className="pt-5 font-bold text-2xl max-md:px-4 lg:hidden">
            Integrate CROPS
          </h1>
          <MainPageHeader>Integrate CROPS</MainPageHeader>
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}

const PAGE_CSS = GARDEN_SURFACES_CSS + GARDEN_ANIMATIONS_CSS
