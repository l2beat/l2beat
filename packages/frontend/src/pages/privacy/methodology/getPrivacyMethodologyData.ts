import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { CollectionEntry } from '~/content/getCollection'
import { getOtherPublicationData } from '~/pages/publications/other-publications/getOtherPublicationData'
import { getOtherPublicationEntry } from '~/pages/publications/other-publications/utils/getOtherPublicationEntry'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getPrivacyMethodologyFigureData } from './getPrivacyMethodologyFigureData'
import { getPrivacyMethodologySections } from './getPrivacyMethodologySections'

/** A publication like any other, but with live figures between its sections. */
export async function getPrivacyMethodologyData(
  manifest: Manifest,
  entry: CollectionEntry<'other-publications'>,
  url: string,
): Promise<RenderData> {
  const { head } = await getOtherPublicationData(manifest, entry, url)
  return {
    head,
    ssr: {
      page: 'PrivacyMethodologyPage',
      props: {
        ...(await getAppLayoutProps()),
        publication: getOtherPublicationEntry(entry),
        sections: getPrivacyMethodologySections(),
        figures: getPrivacyMethodologyFigureData(),
      },
    },
  }
}
