import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getDiagramImage } from '../../../../utils/project/getDiagramImage'
import { Wrapped } from '../../../Page'
import { FinalityPagesData } from '../types'
import { FinalityPageProps } from '../view/ScalingFinalityPage'
import { getPageMetadata } from './getPageMetadata'
import { getScalingFinalityView } from './getScalingFinalityView'

export function getProps(
  config: Config,
  pagesData: FinalityPagesData,
): Wrapped<FinalityPageProps> {
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
      metadata: getPageMetadata(),
      banner: config.features.banner,
    },
  }
}

const diagrams = [
  {
    name: 'State diff ZK rollups',
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
    name: 'Transaction data Optimistic rollups',
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
    name: 'Transaction data ZK rollups',
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
  return getDiagramImage('finality', diagramName, { throwOnMissing: true })
}
