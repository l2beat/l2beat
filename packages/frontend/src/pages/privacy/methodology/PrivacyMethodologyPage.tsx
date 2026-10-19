import { MainPageHeader } from '~/components/MainPageHeader'
import { Article } from '~/components/markdown/Article'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { CategoryMachinesFigure } from './components/CategoryMachinesFigure'
import { CrowdFigure } from './components/CrowdFigure'
import { PoolLensFigure } from './components/PoolLensFigure'
import { SummaryFoldFigure } from './components/SummaryFoldFigure'
import type { PrivacyMethodologyFigureData } from './getPrivacyMethodologyFigureData'
import type { PrivacyMethodologySections } from './getPrivacyMethodologySections'

interface Props extends AppLayoutProps {
  sections: PrivacyMethodologySections
  figures: PrivacyMethodologyFigureData
}

export function PrivacyMethodologyPage({ sections, figures, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Privacy methodology</MainPageHeader>
        <PrimaryCard className="md:p-8">
          <h1 className="mb-4 text-heading-24 md:text-heading-32">
            How we assess privacy protocols
          </h1>
          <main>
            <Section>{sections.intro}</Section>
            <PoolLensFigure data={figures} />
            <Section>{sections.ratings}</Section>
            <CrowdFigure />
            <Section>{sections.adversaries}</Section>
            <Section>{sections.categories}</Section>
            <CategoryMachinesFigure data={figures} />
            <Section>{sections.summaryTable}</Section>
            <SummaryFoldFigure data={figures} />
            <Section>{sections.columns}</Section>
          </main>
        </PrimaryCard>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}

/** One stretch of text between figures; the figures keep their own spacing. */
function Section({ children }: { children: string }) {
  return (
    <Article className="[&>*:last-child]:mb-6 [&>h2:first-child]:mt-10">
      {children}
    </Article>
  )
}
