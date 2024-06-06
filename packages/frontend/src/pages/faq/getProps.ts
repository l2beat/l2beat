import { Config } from '../../build/config'
import { Wrapped } from '../Page'
import { FaqPageProps } from './FaqPage'
import { getFaqItems } from './getFaqItems'

export function getProps(config: Config): Wrapped<FaqPageProps> {
  return {
    props: {
      title: 'Frequently Asked Questions',
      items: getFaqItems(),
    },
    wrapper: {
      metadata: {
        title: 'FAQ - L2BEAT',
        description:
          'Frequently Asked Questions about L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
        image: 'https://l2beat.com/meta-images/pages/og-faq.png',
        url: 'https://l2beat.com/faq/',
      },
      banner: config.features.banner,
    },
  }
}
