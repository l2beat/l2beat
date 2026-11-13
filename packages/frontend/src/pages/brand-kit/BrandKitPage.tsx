import { CustomLink } from '~/components/link/CustomLink'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { RENAME_ANNOUNCEMENT_PATH } from '~/consts/siteName'
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
        <MainPageHeader>Brand kit</MainPageHeader>
        <div className="flex flex-col md:gap-6">
          <LogoSection
            title="Full logo"
            description='The logo is hand-lettered: always use the files as provided, with both the heart and "BEAT", and never retype the name in a font. Please do not change the placement of the pieces or the colors. Always use the full logo when space allows.'
            lightSvgHref="/brand-kit/logo-light.svg"
            darkSvgHref="/brand-kit/logo-dark.svg"
            lightPngHref="/brand-kit/logo-light.png"
            darkPngHref="/brand-kit/logo-dark.png"
          />
          <LogoSection
            title="Symbol"
            description="The heart with ETH in it, for the same colors on dark and light backgrounds. Use the symbol only when the full logo is too large or when ETHBEAT is already identified in context."
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
      <h2 className="mb-1 font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
        {title}
      </h2>
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
            alt="ETHBEAT"
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
            alt="ETHBEAT"
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
      <h2 className="mb-4 font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
        Colors
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 font-medium text-sm">Logo</h3>
          <div className="grid grid-cols-2 gap-3">
            <ColorSwatch color="#FF3776" label="Heart Pink" darkText />
            <ColorSwatch color="#0D0C0C" label="Ink" />
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-medium text-sm">Backgrounds</h3>
          <div className="grid grid-cols-2 gap-3">
            <ColorSwatch color="#0D0C0C" label="Ink" />
            <ColorSwatch color="#FFFFFF" label="White" darkText />
          </div>
        </div>
      </div>
    </PrimaryCard>
  )
}

function NameSection() {
  return (
    <PrimaryCard className="border-divider max-md:border-t">
      <h2 className="mb-2 font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
        Name
      </h2>
      <div className="text-paragraph-15 md:text-paragraph-16">
        <p>
          The name should always be written in uppercase as{' '}
          <strong>ETHBEAT</strong>.
        </p>
        <div className="flex items-center gap-2">
          <SatisfiedIcon className="size-5" /> ETHBEAT
        </div>
        <div className="flex items-center gap-2">
          <MissingIcon className="size-5" /> EthBeat, Ethbeat, Eth Beat, ETH
          BEAT, ETH-BEAT, etc.
        </div>
        <p className="mt-4">
          We used to be called L2BEAT. That name and its logo are retired:
          wherever you show the old ones, please replace them with these.{' '}
          <CustomLink href={RENAME_ANNOUNCEMENT_PATH}>
            Read about the change
          </CustomLink>
          .
        </p>
      </div>
    </PrimaryCard>
  )
}
