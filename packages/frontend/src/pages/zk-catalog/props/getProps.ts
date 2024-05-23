import { VerifiersApiResponse } from '@l2beat/shared-pure'
import { Config } from '../../../build/config'
import { Wrapped } from '../../Page'
import { getDefaultPageMetadata } from '../../metadata'
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
      view: getZkCatalogView(projects, verifiersApiResponse),
    },
    wrapper: {
      metadata: getDefaultPageMetadata({
        url: 'https://l2beat.com/zk-catalog',
        // TODO: Add image
        image: '',
      }),
      banner: config.features.banner,
    },
  }
}
