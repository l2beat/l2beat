import { Layer2 } from '@l2beat/config'
import { DiffHistoryApiResponse } from '@l2beat/shared-pure'

import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { Wrapped } from '../../../Page'
import { DiffHistoryPageProps } from '../view/DiffHistoryPage'
import { diffHistoryToMarkdown } from './diffHistoryToMarkdown'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  project: Layer2,
  config: Config,
  diffHistory: DiffHistoryApiResponse,
): Wrapped<DiffHistoryPageProps> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const entry = diffHistory.find(
    (diff) => diff.project === project.id.toString(),
  )!

  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      footer: getFooterProps(config),
      markdown: diffHistoryToMarkdown(entry.changes),
      header: {
        subPageName: 'Changelog',
        project: {
          name: project.display.name,
          slug: project.display.slug,
        },
      },
    },
    wrapper: {
      metadata: getPageMetadata(project),
      preloadApi: getChartUrl({ type: 'layer2-activity' }),
      banner: config.features.banner,
    },
  }
}
