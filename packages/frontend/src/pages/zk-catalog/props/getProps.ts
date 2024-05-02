import { VerifiersApiResponse } from '@l2beat/shared-pure'
import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { Wrapped } from '../../Page'
import { ZkCatalogPageProps } from '../view/ZkCatalogPage'
import { getZkCatalogView } from './getZkCatalogView'

export function getProps(
  config: Config,
  verifiersApiResponse: VerifiersApiResponse,
): Wrapped<ZkCatalogPageProps> {
  const projects = [
    ...config.zkCatalogProjects,
    ...config.layer2s.filter((l2) => l2.stateValidation?.proofVerification),
    ...config.layer3s.filter((l3) => l3.stateValidation?.proofVerification),
  ]

  return {
    props: {
      navbar: getNavbarProps(config, 'zk-catalog'),
      view: getZkCatalogView(projects, verifiersApiResponse),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: {
        title: 'ZK Catalog – L2BEAT',
        description: 'A catalog of the ZK projects with detailed research.',
        url: 'https://l2beat.com/zk-catalog',
        image: 'https://l2beat.com/meta-images/pages/og-zk-catalog.png',
      },
      banner: config.features.banner,
    },
  }
}
