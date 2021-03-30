import 'react-vis/dist/style.css'

import LinkIcon from '@material-ui/icons/Link'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import TrendingDownIcon from '@material-ui/icons/TrendingDown'
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import cx from 'classnames'
import millify from 'millify'
import Link from 'next/link'
import React from 'react'
import { assert } from 'ts-essentials'

import { AppContainer } from '../../components/AppContainer'
import { Graph } from '../../components/graphs/Graph'
import { NoOfTxs } from '../../components/graphs/NoOfTxs'
import { TVLHistory } from '../../components/graphs/TVLHistory'
import { PageGrid } from '../../components/PageGrid'
import { l2Data, projectsMetaData } from '../../data'
import styles from '../../styles/Home.module.scss'
import { dateSorter } from '../../utils/dateSorter'

export default function Project(props: ReturnType<typeof getStaticProps>['props']) {
  const tvlHistory = React.useMemo(() => props.tvlData.map(({ x, y }: any) => ({ x: new Date(x), y })), undefined)
  const noOfTxs =
    props.noOfTxsData &&
    React.useMemo(() => props.noOfTxsData.map(({ x, y }: any) => ({ x: new Date(x), y })), undefined)

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

        <div className={cx(styles.card, styles.cardBg, styles.projectOverview)}>
          <div className={styles.title}>
            <MonetizationOnIcon />
            <h3>Overview</h3>
            <div
              className={cx(
                styles.badge,
                {
                  [styles.badgeUp]: props.tvlDelta > 0,
                  [styles.badgeDown]: props.tvlDelta < 0,
                },
                'tooltip',
              )}
              tabIndex={0}
              data-content="24h change"
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
              <Link href={(props as any).projectMeta.website}>
                <div className={styles.projectWebsite}>
                  {props.name}
                  <LinkIcon fontSize="large" />
                </div>
              </Link>
            </div>
            <div className={styles.description}>Project website</div>
          </div>
        </div>

        {noOfTxs && (
          <div className={cx(styles.card, styles.noOfTx)}>
            <Graph title={`# of txs`} data={noOfTxs}>
              {(data, container) => <NoOfTxs container={container} data={data} />}
            </Graph>
          </div>
        )}

        <div className={cx(styles.card, styles.cardBg, styles.projectDescription)}>Project description</div>
      </PageGrid>
    </AppContainer>
  )
}

export function getStaticPaths() {
  const projects = Object.keys(l2Data.l2s).map((slug) => slug.toLowerCase())

  return {
    paths: projects.map((project) => {
      return {
        params: {
          project,
        },
      }
    }),
    fallback: false,
  }
}

export function getStaticProps(params: { params: { project: string } }) {
  const [name, projectData]: any = Object.entries(l2Data.l2s).find(
    ([projectName]) => projectName.toLowerCase() === params.params.project,
  )!

  const tvlData = projectData.data.sort(dateSorter).map((point: any) => ({ x: point.date, y: point.usd }))
  const noOfTxsData =
    projectData.data[0].number_of_transactions !== undefined
      ? projectData.data.sort(dateSorter).map((point: any) => ({ x: point.date, y: point.number_of_transactions || 0 }))
      : null

  const tvlDelta =
    (projectData.data[projectData.data.length - 1].usd / projectData.data[projectData.data.length - 2].usd) * 100 - 100

  const projectMetadataFull = Object.entries(projectsMetaData).find(
    ([projectName]) => projectName.toLowerCase() === params.params.project,
  )
  assert(projectMetadataFull, `Couldn't find ${params.params.project} in projects config`)

  const [, projectMeta] = projectMetadataFull

  return {
    props: { tvlData, name, tvl: projectData.TVL, tvlDelta, projectMeta, noOfTxsData },
  }
}
