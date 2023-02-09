
import { Config } from '../../build/config'
import { getFooterProps, getNavbarProps } from '../../components'
import { Wrapped } from '../Page'
import { DefinitionsPageProps } from './DefinitionsPage'

export function getProps(config: Config): Wrapped<DefinitionsPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'definitions'),
      title: 'Definitions',
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: {
        title: 'L2BEAT - Definitions',
        description:
          'Definitions of rollup ratings used on L2BEAT. Learn more about the L2BEAT rollup ratings and how they are calculated.',
        image: 'https://l2beat.com/meta-images/overview-scaling.png',
        url: 'https://l2beat.com/faq/',
      },
    },
  }
}
