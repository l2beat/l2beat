import { Article } from '~/components/markdown/Article'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { PublicationLayout } from '~/pages/publications/components/PublicationLayout'
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
    // Text keeps the article column (Section); figures span the card.
    <PublicationLayout publication={publication} wide {...props}>
      <Section>{sections.intro}</Section>
      <PoolLensFigure data={figures} />
      <Section>{sections.ratings}</Section>
      <CrowdFigure />
      <Section>{sections.adversaries}</Section>
      <Section>{sections.categories}</Section>
      <CategoryMachinesFigure data={figures} />
      <Section>{sections.columns}</Section>
      <ScrollToTopButton />
    </PublicationLayout>
  )
}

/** One stretch of text between figures; the figures keep their own spacing. */
function Section({ children }: { children: string }) {
  return (
    <Article className="mx-auto max-w-[720px] [&>*:last-child]:mb-6 [&>h2:first-child]:mt-10">
      {children}
    </Article>
  )
}
