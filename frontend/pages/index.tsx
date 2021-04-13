import 'react-vis/dist/style.css'

import ListIcon from '@material-ui/icons/List'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import TrendingDownIcon from '@material-ui/icons/TrendingDown'
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import cx from 'classnames'
import { sortBy } from 'lodash'
import millify from 'millify'
import React from 'react'
import { assert } from 'ts-essentials'

import { AppContainer } from '../components/AppContainer'
import { Filter, Graph } from '../components/graphs/Graph'
import { TVLHistory } from '../components/graphs/TVLHistory'
import { FullPageGrid } from '../components/PageGrid'
import { l2Data, projectsMetaData } from '../data'
import styles from '../styles/Home.module.scss'
import { dateSorter } from '../utils/dateSorter'

type Unpack<T> = T extends Promise<infer U> ? U : never
type Props = Unpack<ReturnType<typeof getStaticProps>>['props']

export default function Home({ dominant, l2Data, tvlHistory: tvlHistory_, tvlDelta, l2sTable }: Props) {
  const tvlHistory = React.useMemo(() => tvlHistory_.map(({ x, y }: any) => ({ x: new Date(x), y })), [l2Data])

  const badgeText = Math.abs(tvlDelta) < 0.01 ? `${tvlDelta > 0 ? '>' : '<-'}0.01%` : `${tvlDelta.toFixed(2)}%`

  return (
    <AppContainer>
      <h2 className={styles.overview}>Projects overview</h2>
      <FullPageGrid>
        <div className={cx(styles.card, styles.graph)}>
          <Graph title="Total value locked in USD" data={tvlHistory} defaultFilter={Filter.NINETY_DAYS}>
            {(data, container) => <TVLHistory container={container} data={data} />}
          </Graph>
        </div>
        <div className={cx(styles.card, styles.cardBg, styles.overviewCard)}>
          <div className={styles.title}>
            <MonetizationOnIcon />
            <h3>Overview</h3>
            <div
              className={cx(
                styles.badge,
                {
                  [styles.badgeUp]: tvlDelta > 0,
                  [styles.badgeDown]: tvlDelta < 0,
                },
                'tooltip',
              )}
              tabIndex={0}
              data-content="24h change"
            >
              {badgeText}
              {tvlDelta === 0 ? <TrendingFlatIcon /> : tvlDelta > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
            </div>
          </div>
          <div className={styles.overview}>
            <div className={styles.tvl}>${millify(l2Data.TVL)}</div>
            <div className={styles.description}>Total value locked</div>
            <div className={styles.dominance}>{dominant.share.toFixed(2)}%</div>
            <div className={styles.description}>{dominant.name} dominance</div>
          </div>
        </div>
        <div className={cx(styles.card, styles.cardBg, styles.projectsList)}>
          <div className={styles.title}>
            <ListIcon />
            <h3>Projects list</h3>
          </div>
          <table className={styles.table}>
            <colgroup>
              <col width="10%"></col>
              <col width="30%"></col>
              <col width="25%"></col>
              <col width="25%"></col>
              <col width="15%"></col>
            </colgroup>
            <thead>
              <tr className={styles.tableHeader}>
                <th>name</th>
                <th className={styles.alignRight}>Value locked</th>
                <th className={styles.alignRight}>Market share</th>
                <th className={styles.alignRight}>Tech</th>
                <th className={styles.alignRight}>1 day %</th>
              </tr>
            </thead>
            <tbody>
              {l2sTable.map((rowData, index) => {
                return (
                  <a
                    role="table-row"
                    style={{ display: 'table-row' }}
                    tabIndex={0}
                    title={`${rowData.name} overview`}
                    href={`/project/${rowData.name.toLowerCase()}`}
                    key={rowData.name}
                    className={styles.dataRow}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'baseline' }}>
                        <div className={styles.projectBadge} style={{ background: rowData.meta.color }}></div>
                        <div className={styles.projectName}>
                          {index + 1}. {rowData.name}
                        </div>
                      </div>
                    </td>
                    <td className={cx(styles.alignRight, styles.mono)}>${millify(rowData.tvl)}</td>
                    <td className={cx(styles.alignRight, styles.mono)}>{rowData.share.toFixed(2)}%</td>
                    <td className={cx(styles.alignRight)}>{rowData.meta.technology}</td>
                    <td className={cx(styles.alignRight)}>
                      <Percentage value={rowData.change} />
                    </td>
                  </a>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className={cx(styles.card, styles.cardBg, styles.links)}>
          <div className={styles.title}>
            <MenuBookIcon />
            <h3>Learn about Layer 2</h3>
          </div>
          <ul>
            <li>
              <a href="https://ethereum.org/en/developers/docs/layer-2-scaling/">Confused? Layer 2 primer</a>
            </li>
            <li>
              <a href="https://vitalik.ca/general/2021/01/05/rollup.html">An Incomplete Guide to Rollups</a>
            </li>
            <li>
              <a href="https://research.paradigm.xyz/rollups">Everything you need to know about Optimistic Rollup</a>
            </li>
            <li>
              <a href="https://research.paradigm.xyz/optimism">How does Optimism's Rollup really work?</a>
            </li>
          </ul>
        </div>
        <div className={cx(styles.card, styles.cardBg, styles.faq)}>
          <div className={styles.title}>
            <MenuBookIcon />
            <h3>How do we calculate TVL?</h3>
          </div>
          <p>
            We track assets (tokens and ether) parked on various token bridges on layer 1. A single L2 can have multiple
            token bridges (for example Optimism).
          </p>

          <p>
            For details, see{' '}
            <a href="https://github.com/krzkaczor/l2beat/blob/master/data_pipeline/config.json">config</a>.
          </p>
        </div>
      </FullPageGrid>
    </AppContainer>
  )
}
export async function getStaticProps() {
  const TVLDataSorted = l2Data.data.sort(dateSorter)
  const tvlHistory = TVLDataSorted.map((point: any) => ({
    x: point.date,
    y: point.usd,
  }))

  const dominant = Object.entries(l2Data.l2s).sort(([, data1]: any, [, data2]: any) => data2.TVL - data1.TVL)

  const tvlDelta =
    (TVLDataSorted[TVLDataSorted.length - 1].usd / TVLDataSorted[TVLDataSorted.length - 2].usd) * 100 - 100

  const l2sTable = Object.entries(l2Data.l2s).map(([name, data]: any) => {
    const tvlData = data.data.sort(dateSorter).reverse()
    const meta = projectsMetaData[name]
    assert(meta, `Can't find project data for ${name}`)

    return {
      name,
      tvl: data.TVL,
      share: (data.TVL / l2Data.TVL) * 100,
      change: (tvlData[0].usd / tvlData[1].usd) * 100 - 100,
      tvlData,
      meta,
    }
  })

  const l2sTableSorted = sortBy(l2sTable, (v) => -v.share)

  return {
    props: {
      title: 'L2Beat 💓',
      l2Data,
      tvlHistory,
      dominant: {
        name: dominant[0][0],
        share: ((dominant as any)[0][1].TVL / l2Data.TVL) * 100,
      },
      tvlDelta,
      l2sTable: l2sTableSorted,
    },
  }
}

function Percentage({ value }: { value: number }) {
  const valueAsString = value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2)
  const color = value >= 0 ? 'rgb(49 150 39)' : '#b31020'
  return <span style={{ color }}>{valueAsString}%</span>
}
