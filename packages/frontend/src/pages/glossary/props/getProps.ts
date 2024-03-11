import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getCollection } from '../../../content/getCollection'
import { Wrapped } from '../../Page'
import { GlossaryPageProps } from '../view/GlossaryPage'
import { getGlossaryEntry } from './getGlossaryEntry'

export function getProps(config: Config): Wrapped<GlossaryPageProps> {
  const glossaryEntries = getCollection('glossary')

  return {
    props: {
      entries: glossaryEntries.map(getGlossaryEntry),
      navbar: getNavbarProps(config, 'glossary'),
      footer: getFooterProps(config),
    },
    wrapper: {
      banner: config.features.banner,
      metadata: {
        title: 'Glossary',
        description: 'A glossary of terms related to Layer2s of Ethereum.',
        // TODO: (glossary) Add a proper image
        image: 'https://l2beat.com/meta-images/glossary.png',
        url: 'https://l2beat.com/glossary',
      },
    },
  }
}
