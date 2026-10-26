import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { CollectionEntry } from '~/content/getCollection'
import { getOtherPublicationHead } from '~/pages/publications/other-publications/getOtherPublicationData'
import { getOtherPublicationEntry } from '~/pages/publications/other-publications/utils/getOtherPublicationEntry'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getPrivacyMethodologyFigureData } from './getPrivacyMethodologyFigureData'
import { getPrivacyMethodologySections } from './getPrivacyMethodologySections'

/** A publication like any other, but with live figures between its sections. */
export async function getPrivacyMethodologyData(
  manifest: Manifest,
  publicationEntry: CollectionEntry<'other-publications'>,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const publication = getOtherPublicationEntry(publicationEntry)
  return {
    head: getOtherPublicationHead(manifest, publicationEntry, publication, url),
    ssr: {
      page: 'PrivacyMethodologyPage',
      props: {
        ...appLayoutProps,
        publication,
        sections: getPrivacyMethodologySections(),
        figures: getPrivacyMethodologyFigureData(),
      },
    },
  }
}
