import { MainPageHeader } from '~/components/MainPageHeader'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { GardenBackground } from './assets/GardenBackground'
import { GardenTable } from './components/GardenTable'
import type { GardenEntry } from './getGardenData'

interface Props extends AppLayoutProps {
  entries: GardenEntry[]
}

export function GardenPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <style>{PAGE_CSS}</style>
        <div className="relative flex grow flex-col pb-24">
          <GardenBackground />
          <div className="relative">
            <h1 className="pt-5 font-bold text-2xl max-md:px-4 lg:hidden">
              The Infinite Garden
            </h1>
            <MainPageHeader description="Each project is evaluated across the CROPS framework: Censorship Resistance, Open source, Privacy, and Security. Hover a plant for the reasoning behind its evaluation.">
              The Infinite Garden
            </MainPageHeader>
            <div className="mt-4 overflow-hidden rounded-xl bg-surface-primary max-md:mx-4 md:px-6">
              <GardenTable entries={entries} />
            </div>
          </div>
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}

const PAGE_CSS = `
/* The garden background is a fixed full-viewport layer at z-index -1, just
   above the html canvas background. body, the sidebar layout wrapper, and the
   side nav panel all repeat the same opaque background color, which would
   hide it or cut it off at the nav edge - make them transparent on this page
   only so the garden runs under the entire viewport. */
body{background:transparent}
.group\\/sidebar-wrapper{background:transparent}
[data-role="nav-sidebar"]>div{background:transparent}
@keyframes garden-grow{0%{transform:scaleY(.02);opacity:0}55%{opacity:1}100%{transform:scaleY(1);opacity:1}}
@keyframes garden-leaf{0%{transform:scale(.01)}100%{transform:scale(1)}}
@keyframes garden-bloom{0%{transform:scale(0);opacity:0}70%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
@keyframes garden-pop{0%{transform:scale(.3);opacity:0}70%{transform:scale(1.09)}100%{transform:scale(1);opacity:1}}
@keyframes garden-sway{0%,100%{transform:rotate(-2.6deg)}50%{transform:rotate(2.6deg)}}
@keyframes garden-sway-s{0%,100%{transform:rotate(-1.5deg)}50%{transform:rotate(1.5deg)}}
@keyframes garden-wilt{0%,100%{transform:rotate(-.5deg) translateY(0)}50%{transform:rotate(1.6deg) translateY(.5px)}}
@keyframes garden-ghost{0%,100%{opacity:.5}50%{opacity:.82}}
@keyframes garden-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
`
