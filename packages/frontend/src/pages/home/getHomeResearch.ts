import { getCollection } from '~/content/getCollection'
import {
  getPublicationEntryFromExternalPublication,
  getPublicationEntryFromOtherPublication,
  type PublicationEntry,
} from '../publications/utils/getPublicationEntry'

const RESEARCH_COUNT = 3

export type HomeResearchItem = Pick<
  PublicationEntry,
  'id' | 'title' | 'shortTitle' | 'url' | 'publishedOn' | 'thumbnail'
>

/** The latest entries of the Research tab on /publications. */
export function getHomeResearch(): HomeResearchItem[] {
  return getCollection('other-publications')
    .map(getPublicationEntryFromOtherPublication)
    .concat(
      getCollection('external-publications').map(
        getPublicationEntryFromExternalPublication,
      ),
    )
    .filter((entry) => entry.tag === 'Research')
    .sort((a, b) => b.publishedOn - a.publishedOn)
    .slice(0, RESEARCH_COUNT)
    .map(({ id, title, shortTitle, url, publishedOn, thumbnail }) => ({
      id,
      title,
      shortTitle,
      url,
      publishedOn,
      thumbnail,
    }))
}
