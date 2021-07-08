import 'react-vis/dist/style.css'

import l2Data from '@l2beat/backend'
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

import { AppContainer } from '../components/AppContainer'
import { Filter, Graph } from '../components/graphs/Graph'
import { TVLHistory } from '../components/graphs/TVLHistory'
import { FullPageGrid } from '../components/PageGrid'
import styles from '../styles/Home.module.scss'
import { findProjectMetadata } from '../utils/findProjectMetadata'

type Unpack<T> = T extends Promise<infer U> ? U : never
type Props = Unpack<ReturnType<typeof getStaticProps>>['props']

export default function Home({ tvl, tvlHistory: tvlHistory_, tvlDelta, l2sTable }: Props) {
  const tvlHistory = React.useMemo(() => tvlHistory_.map(([x, y]) => ({ x: new Date(x), y })), [tvlHistory_])

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
            <div className={styles.tvl}>${millify(tvl)}</div>
            <div className={styles.description}>Total value locked</div>
            <div className={styles.dominance}>{l2sTable[0].share.toFixed(2)}%</div>
            <div className={styles.description}>{l2sTable[0].name} dominance</div>
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
              {l2sTable.map((item, index) => {
                return (
                  <a
                    role="table-row"
                    style={{ display: 'table-row' }}
                    tabIndex={0}
                    title={`${item.name} overview`}
                    href={`/project/${item.name.toLowerCase()}`}
                    key={item.name}
                    className={cx(styles.dataRow, item.notL2 && styles.notL2)}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'baseline' }}>
                        <div className={styles.projectBadge} style={{ background: item.color }}></div>
                        <div className={styles.projectName}>
                          {index + 1}. {item.name}
                        </div>
                      </div>
                    </td>
                    <td className={cx(styles.alignRight, styles.mono)}>${millify(item.tvl)}</td>
                    <td className={cx(styles.alignRight, styles.mono)}>{item.share.toFixed(2)}%</td>
                    <td className={cx(styles.alignRight)}>{item.technology}</td>
                    <td className={cx(styles.alignRight)}>
                      <Percentage value={item.change} />
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
            <a href="https://github.com/l2beat/l2beat/tree/master/config/src/projects">the configuration</a>.
          </p>
        </div>
      </FullPageGrid>
    </AppContainer>
  )
}
export async function getStaticProps() {
  const sorted = l2Data.aggregate.data
  const tvlHistory = l2Data.aggregate.data.map(([date, usd]) => [date, usd] as const)
  const totalTvl = tvlHistory[tvlHistory.length - 1][1]

  const tvlDelta = (sorted[sorted.length - 1][1] / sorted[sorted.length - 2][1]) * 100 - 100

  const l2sTable = Object.entries(l2Data.byProject).map(([name, data]) => {
    const tvlData = data.aggregate.data
    const meta = findProjectMetadata(name)
    const tvl = tvlData[tvlData.length - 1][1]
    return {
      name,
      tvl,
      share: (tvl / totalTvl) * 100,
      change: (tvlData[tvlData.length - 1][1] / tvlData[tvlData.length - 2][1]) * 100 - 100,
      notL2: !!meta.showNotL2Warning,
      color: meta.color,
      technology: meta.technology.name,
    }
  })

  const l2sTableSorted = sortBy(l2sTable, (v) => -v.share)

  return {
    props: {
      title: 'L2Beat 💓',
      tvl: totalTvl,
      tvlHistory,
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
