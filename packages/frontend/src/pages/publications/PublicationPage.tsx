import { Article } from '~/components/markdown/Article'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import type { GovernancePublicationEntry } from '~/pages/publications/governance/utils/getGovernancePublicationEntry'
import type { OtherPublicationEntry } from '~/pages/publications/other-publications/utils/getOtherPublicationEntry'
import { PublicationLayout } from './components/PublicationLayout'

interface Props extends AppLayoutProps {
  publication: OtherPublicationEntry | GovernancePublicationEntry
}

export function PublicationPage({ publication, ...props }: Props) {
  return (
    <PublicationLayout publication={publication} {...props}>
      <Article>{publication.content}</Article>
    </PublicationLayout>
  )
}
