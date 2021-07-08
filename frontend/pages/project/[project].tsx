import l2Data from '@l2beat/backend'
import ImportContactsIcon from '@material-ui/icons/ImportContacts'
import InfoIcon from '@material-ui/icons/Info'
import LinkIcon from '@material-ui/icons/Link'
import TrendingDownIcon from '@material-ui/icons/TrendingDown'
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import cx from 'classnames'
import millify from 'millify'
import React from 'react'

import { AppContainer } from '../../components/AppContainer'
import { ProjectDescription } from '../../components/description/ProjectDescription'
import { Graph } from '../../components/graphs/Graph'
import { TVLHistory } from '../../components/graphs/TVLHistory'
import { PageGrid } from '../../components/PageGrid'
import styles from '../../styles/Home.module.scss'
import { findProjectBridges } from '../../utils/findProjectBridges'
import { findProjectMetadata } from '../../utils/findProjectMetadata'
import { getProjectsPaths } from '../../utils/getProjectPaths'

export default function Project(props: ReturnType<typeof getStaticProps>['props']) {
  const tvlHistory = React.useMemo(() => props.tvlData.map(([x, y]) => ({ x: new Date(x), y })), [props.tvlData])

  const badgeText =
    Math.abs(props.tvl) < 0.01 ? `${props.tvlDelta > 0 ? '>' : '<-'}0.01%` : `${props.tvlDelta.toFixed(2)}%`

  return (
    <AppContainer>
      <h2 className={styles.overview}>{props.name} overview</h2>
      <PageGrid>
        <div className={cx(styles.card, styles.projectTvl)}>
          <Graph title={`Total value locked in USD`} data={tvlHistory}>
            {(data, container) => <TVLHistory container={container} data={data} />}
          </Graph>
        </div>

        <div
          style={{ background: props.projectMetadata.color }}
          className={cx(styles.card, styles.cardBg, styles.projectOverview, styles.invertedTitle)}
        >
          <div className={cx(styles.title)}>
            <InfoIcon />
            <h3>Overview</h3>
            <div
              className={cx(styles.badge, {
                [styles.badgeUp]: props.tvlDelta > 0,
                [styles.badgeDown]: props.tvlDelta < 0,
              })}
              tabIndex={0}
            >
              {badgeText}
              {props.tvlDelta === 0 ? (
                <TrendingFlatIcon />
              ) : props.tvlDelta > 0 ? (
                <TrendingUpIcon />
              ) : (
                <TrendingDownIcon />
              )}
            </div>
          </div>
          <div className={styles.overview}>
            <div className={styles.tvl}>${millify(props.tvl)}</div>
            <div className={styles.description}>Total value locked</div>
            <div className={styles.dominance}>
              <a href={props.projectMetadata.website} target="blank">
                <div className={styles.projectWebsite}>
                  {props.name}
                  <LinkIcon fontSize="large" />
                </div>
              </a>
            </div>
            <div className={styles.description}>Project website</div>
          </div>
        </div>

        <div className={cx(styles.card, styles.cardBg, styles.projectDetails)}>
          <div className={styles.title}>
            <ImportContactsIcon />
            <h3>Project in a nutshell</h3>
          </div>
          <ProjectDescription metadata={props.projectMetadata} bridges={props.projectBridges} />
        </div>
      </PageGrid>
    </AppContainer>
  )
}

export function getStaticPaths() {
  return getProjectsPaths()
}

export function getStaticProps(params: { params: { project: string } }) {
  const [name, projectData] = Object.entries(l2Data.byProject).find(
    ([projectName]) => projectName.toLowerCase() === params.params.project,
  )!

  const tvlData = projectData.aggregate.data.map(([date, usd]) => [date, usd] as const)

  const tvlDelta = (tvlData[tvlData.length - 1][1] / tvlData[tvlData.length - 2][1]) * 100 - 100

  const projectMetadata = findProjectMetadata(params.params.project)
  const projectBridges = findProjectBridges(params.params.project)

  return {
    props: {
      title: `L2Beat 💓 ${name} overview`,
      description: `${name} total value locked increased ${millify(tvlDelta)}% in last 24h!`,
      tvlData,
      name,
      tvl: tvlData[tvlData.length - 1][1],
      tvlDelta,
      projectMetadata,
      projectBridges,
    },
  }
}
