import { MainPageHeader } from '~/components/MainPageHeader'
import { ZK_CATALOG_DESCRIPTION } from '~/consts/summaryPageDescriptions'

export function ZkCatalogHeader() {
  return (
    <MainPageHeader description={ZK_CATALOG_DESCRIPTION}>
      ZK Catalog
    </MainPageHeader>
  )
}
