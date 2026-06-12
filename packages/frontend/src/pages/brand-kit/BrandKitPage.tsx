import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { MissingIcon } from '~/icons/Missing'
import { SatisfiedIcon } from '~/icons/Satisfied'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ColorSwatch } from './components/ColorSwatch'
import { LogoPreviewCard } from './components/LogoPreviewCard'

export function BrandKitPage(props: AppLayoutProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Brand Kit</MainPageHeader>
        <div className="flex flex-col md:gap-6">
          <LogoSection
            title="Full Logo"
            description='The logo should always be used as provided - with both the "L2" icon and "BEAT". Please do not change the placement of the pieces and change the colors. Always use the full logo when space allows.'
            lightSvgHref="/brand-kit/logo-light.svg"
            darkSvgHref="/brand-kit/logo-dark.svg"
            lightPngHref="/brand-kit/logo-light.png"
            darkPngHref="/brand-kit/logo-dark.png"
          />
          <LogoSection
            title="Symbol"
            description="Use the symbol only when the full logo is too large or when L2BEAT is
          already identified in context."
            lightSvgHref="/brand-kit/symbol-light.svg"
            darkSvgHref="/brand-kit/symbol-dark.svg"
            lightPngHref="/brand-kit/symbol-light.png"
            darkPngHref="/brand-kit/symbol-dark.png"
          />
          <ColorsSection />
          <NameSection />
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}

function LogoSection({
  title,
  description,
  lightSvgHref,
  darkSvgHref,
  lightPngHref,
  darkPngHref,
}: {
  title: string
  description: string
  lightSvgHref: string
  darkSvgHref: string
  lightPngHref: string
  darkPngHref: string
}) {
  return (
    <PrimaryCard className="border-divider max-md:not-first:border-t">
      <h2 className="mb-1 font-bold text-xl">{title}</h2>
      <div className="mb-4 text-secondary text-xs">
        <p>{description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <LogoPreviewCard
          background="dark"
          svgHref={lightSvgHref}
          pngHref={lightPngHref}
        >
          <img
            src={lightSvgHref}
            className="h-20 w-auto"
            alt="L2BEAT"
            loading="lazy"
          />
        </LogoPreviewCard>
        <LogoPreviewCard
          background="light"
          svgHref={darkSvgHref}
          pngHref={darkPngHref}
        >
          <img
            src={darkSvgHref}
            className="h-20 w-auto"
            alt="L2BEAT"
            loading="lazy"
          />
        </LogoPreviewCard>
      </div>
    </PrimaryCard>
  )
}

function ColorsSection() {
  return (
    <PrimaryCard className="border-divider max-md:border-t">
      <h2 className="mb-4 font-bold text-xl">Colors</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 font-medium text-sm">Dark Mode</h3>
          <div className="grid grid-cols-2 gap-3">
            <ColorSwatch color="#BD114F" label="Brand Red" />
            <ColorSwatch color="#FAFAFA" label="Text" darkText />
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-medium text-sm">Light Mode</h3>
          <div className="grid grid-cols-2 gap-3">
            <ColorSwatch color="#F9347B" label="Brand Red" />
            <ColorSwatch color="#1B1B1B" label="Text" />
          </div>
        </div>
      </div>
    </PrimaryCard>
  )
}

function NameSection() {
  return (
    <PrimaryCard className="border-divider max-md:border-t">
      <h2 className="mb-2 font-bold text-xl">Name</h2>
      <div className="text-paragraph-15 md:text-paragraph-16">
        <p>
          The name should always be written in uppercase as{' '}
          <strong>L2BEAT</strong>.
        </p>
        <div className="flex items-center gap-2">
          <SatisfiedIcon className="size-5" /> L2BEAT
        </div>
        <div className="flex items-center gap-2">
          <MissingIcon className="size-5" /> L2 BEAT, L2Beat, L2beat, L2-beat,
          etc.
        </div>
      </div>
    </PrimaryCard>
  )
}
