import { Config } from '../../../build/config'
import { getCollection } from '../../../content/getCollection'
import { Wrapped } from '../../Page'
import { GlossaryPageProps } from '../view/GlossaryPage'
import { getGlossaryEntry } from './getGlossaryEntry'
import { getPageMetadata } from './getPageMetadata'

export function getProps(config: Config): Wrapped<GlossaryPageProps> {
  const glossaryEntries = getCollection('glossary')

  return {
    props: {
      entries: glossaryEntries.map(getGlossaryEntry),
    },
    wrapper: {
      banner: config.features.banner,
      metadata: getPageMetadata(),
    },
  }
}
