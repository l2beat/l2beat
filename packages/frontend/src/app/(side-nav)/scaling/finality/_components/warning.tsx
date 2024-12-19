import { CustomLink } from '~/components/link/custom-link'
import { MainPageWarning } from '~/components/main-page-warning'
import { externalLinks } from '~/consts/external-links'

export function FinalityWarning() {
  return (
    <MainPageWarning className="mb-4">
      Please note, the values on the page reflect the time required to achieve
      ordering finality, at which point transactions cannot be reverted or
      reordered. For simplicity, they do not include the overhead time to reach
      L1 finality, which is the same for all projects. The actionable settlement
      time on the L1 (that affects your ability to withdraw your funds on the
      L1) for these transactions may be longer. In most other cases, however,
      this does not apply (e.g., when transferring funds to an exchange). For
      more information on how finality works for L2 transactions, check{' '}
      <CustomLink
        href={externalLinks.articles.finality}
        className="dark:text-blue-700"
      >
        our article
      </CustomLink>
      .
    </MainPageWarning>
  )
}
