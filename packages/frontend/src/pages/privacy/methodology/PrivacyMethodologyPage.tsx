import { MainPageHeader } from '~/components/MainPageHeader'
import { Article } from '~/components/markdown/Article'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { PublicationHeader } from '~/pages/publications/components/PublicationHeader'
import type { OtherPublicationEntry } from '~/pages/publications/other-publications/utils/getOtherPublicationEntry'
import { CategoryMachinesFigure } from './components/CategoryMachinesFigure'
import { CrowdFigure } from './components/CrowdFigure'
import { PoolLensFigure } from './components/PoolLensFigure'
import type { PrivacyMethodologyFigureData } from './getPrivacyMethodologyFigureData'
import type { PrivacyMethodologySections } from './getPrivacyMethodologySections'

interface Props extends AppLayoutProps {
  publication: OtherPublicationEntry
  sections: PrivacyMethodologySections
  figures: PrivacyMethodologyFigureData
}

/** Laid out like any publication, with live figures between the sections. */
export function PrivacyMethodologyPage({
  publication,
  sections,
  figures,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Publication</MainPageHeader>
        <PrimaryCard className="md:p-8">
          <PublicationHeader publication={publication} />
          <main className="mx-auto mt-8 max-w-[720px] md:pt-8">
            <img
              {...publication.thumbnail}
              alt={`${publication.title} publication thumbnail`}
              className="mb-12 w-full rounded-lg"
            />
            <Section>{sections.intro}</Section>
            <PoolLensFigure data={figures} />
            <Section>{sections.ratings}</Section>
            <CrowdFigure />
            <Section>{sections.adversaries}</Section>
            <Section>{sections.categories}</Section>
            <CategoryMachinesFigure data={figures} />
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
