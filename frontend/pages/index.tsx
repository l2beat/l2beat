import 'react-vis/dist/style.css'

import ListIcon from '@material-ui/icons/List'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import TrendingDownIcon from '@material-ui/icons/TrendingDown'
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import cx from 'classnames'
import millify from 'millify'
import Link from 'next/link'
import React from 'react'

import { AppContainer } from '../components/AppContainer'
import { Graph } from '../components/Graph'
import { PageGrid } from '../components/PageGrid'
import { l2Data } from '../data'
import styles from '../styles/Home.module.scss'
import { tvlSorter } from '../utils/tvlSorter'

type Unpack<T> = T extends Promise<infer U> ? U : never
type Props = Unpack<ReturnType<typeof getStaticProps>>['props']

const projectColors: Record<string, string> = {
  optimism: '#EE6C72',
  zksync: '#8B90F5',
  default: '#A9A9A9',
}

export default function Home({ dominant, l2Data, tvlHistory: tvlHistory_, tvlDelta, l2sTable }: Props) {
  const tvlHistory = React.useMemo(() => tvlHistory_.map(({ x, y }: any) => ({ x: new Date(x), y })), [l2Data])

  const badgeText = Math.abs(tvlDelta) < 0.01 ? `${tvlDelta > 0 ? '>' : '<-'}0.01%` : `${tvlDelta.toFixed(2)}%`

  return (
    <AppContainer>
      <h2 className={styles.overview}>Projects overview</h2>
      <PageGrid>
        <div className={styles.card}>
          <Graph title="Total value locked in USD" data={tvlHistory} />
        </div>
        <div className={cx(styles.card, styles.cardBg, styles.overviewCard)}>
          <div className={styles.title}>
            <MonetizationOnIcon />
            <h3>Overview</h3>
            <div className={cx(styles.badge, { [styles.badgeUp]: tvlDelta > 0, [styles.badgeDown]: tvlDelta < 0 })}>
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
        <div className={cx(styles.card, styles.cardBg)}>
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
            </colgroup>
            <thead>
              <tr className={styles.tableHeader}>
                <th>name</th>
                <th className={styles.alignRight}>Value locked</th>
                <th className={styles.alignRight}>Market share</th>
              </tr>
            </thead>
            <tbody>
              {l2sTable.map((rowData) => (
                <tr className={styles.dataRow}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <div
                        className={styles.projectBadge}
                        style={{ background: projectColors[rowData.name.toLowerCase()] || projectColors.default }}
                      ></div>
                      <div>{rowData.name}</div>
                    </div>
                  </td>
                  <td className={cx(styles.alignRight, styles.mono)}>${millify(rowData.tvl)}</td>
                  <td className={cx(styles.alignRight, styles.mono)}>{rowData.share.toFixed(2)}%</td>
                  <td className={cx(styles.alignRight)}>
                    <Link href={`/project/${rowData.name.toLowerCase()}`}>
                      <div className={styles.projectLink}>View project</div>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={cx(styles.card, styles.cardBg)}>
          <div className={styles.title}>
            <MenuBookIcon />
            <h3>Learn about layer 2</h3>
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
      </PageGrid>
    </AppContainer>
  )
}
export async function getStaticProps() {
  const TVLDataSorted = l2Data.data.sort(tvlSorter)
  const tvlHistory = TVLDataSorted.map((point: any) => ({
    x: point.date,
    y: point.usd,
  }))

  const dominant = Object.entries(l2Data.l2s).sort(([, data1]: any, [, data2]: any) => data2.TVL - data1.TVL)

  const tvlDelta =
    (TVLDataSorted[TVLDataSorted.length - 1].usd / TVLDataSorted[TVLDataSorted.length - 2].usd) * 100 - 100

  const l2sTable = Object.entries(l2Data.l2s).map(([name, data]: any) => {
    const tvlData = data.data.sort(tvlSorter).reverse()

    return {
      name,
      tvl: data.TVL,
      share: (data.TVL / l2Data.TVL) * 100,
      change: (tvlData[0].usd / tvlData[1].usd) * 100 - 100,
      tvlData,
    }
  })

  return {
    props: {
      l2Data,
      tvlHistory,
      dominant: {
        name: dominant[0][0],
        share: ((dominant as any)[0][1].TVL / l2Data.TVL) * 100,
      },
      tvlDelta,
      l2sTable,
    },
  }
}
