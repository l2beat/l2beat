import { CustomLink } from '~/components/link/CustomLink'
import { MainPageHeader } from '~/components/MainPageHeader'
import { externalLinks } from '~/consts/externalLinks'

export function FinalityHeader() {
  return (
    <MainPageHeader
      description={
        <>
          Finality reflects the time required to achieve ordering finality,
          after which transactions cannot be reverted or reordered. The values
          shown do not include the additional overhead time required to reach L1
          finality, which remains the same for all projects. The actionable
          settlement time on L1 (which affects when you can withdraw funds) may
          be longer. For more details on how finality works for L2 transactions,
          check{' '}
          <CustomLink
            href={externalLinks.articles.finality}
            className="dark:text-blue-700"
          >
            our article
          </CustomLink>
          .
        </>
      }
    >
      Finality
    </MainPageHeader>
  )
}
