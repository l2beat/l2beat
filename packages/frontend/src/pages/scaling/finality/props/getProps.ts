import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getDiagramImageOrThrow } from '../../../../utils/project/getDiagramImage'
import { getDefaultPageMetadata } from '../../../metadata'
import { Wrapped } from '../../../Page'
import { FinalityPagesData } from '../types'
import { ScalingFinalityPageProps } from '../view/ScalingFinalityPage'
import { getScalingFinalityView } from './getScalingFinalityView'

export function getProps(
  config: Config,
  pagesData: FinalityPagesData,
): Wrapped<ScalingFinalityPageProps> {
  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      finalityView: getScalingFinalityView(config.layer2s, pagesData),
      diagrams,
      footer: getFooterProps(config),
      showActivity: config.features.activity,
      showLiveness: config.features.liveness,
      showFinality: config.features.finality,
    },
    wrapper: {
      metadata: getDefaultPageMetadata({
        image: 'https://l2beat.com/meta-images/overview-scaling.png',
        url: 'https://l2beat.com/scaling/finality',
      }),
      banner: config.features.banner,
    },
  }
}

const diagrams = [
  {
    name: 'State diff\nZK rollups',
    src: {
      dark: {
        desktop: getDiagram('state-diff-zk-dark'),
        mobile: getDiagram('state-diff-zk-dark-mobile'),
      },
      light: {
        desktop: getDiagram('state-diff-zk'),
        mobile: getDiagram('state-diff-zk-mobile'),
      },
    },
  },
  {
    name: 'Transaction data\nOptimistic rollups',
    src: {
      dark: {
        desktop: getDiagram('transaction-data-optimistic-dark'),
        mobile: getDiagram('transaction-data-optimistic-dark-mobile'),
      },
      light: {
        desktop: getDiagram('transaction-data-optimistic'),
        mobile: getDiagram('transaction-data-optimistic-mobile'),
      },
    },
  },
  {
    name: 'Transaction data\nZK rollups',
    src: {
      dark: {
        desktop: getDiagram('transaction-data-zk-dark'),
        mobile: getDiagram('transaction-data-zk-dark-mobile'),
      },
      light: {
        desktop: getDiagram('transaction-data-zk'),
        mobile: getDiagram('transaction-data-zk-mobile'),
      },
    },
  },
]

function getDiagram(diagramName: string) {
  return getDiagramImageOrThrow('finality', diagramName)
}
