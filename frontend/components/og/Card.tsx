import React from 'react'
import { AreaSeries, GradientDefs, LineSeries, LineSeriesPoint, XYPlot } from 'react-vis'

import { Icon } from './Icons'
import styles from './og.module.scss'

interface Stat {
  name: string
  value: string
  icon?: keyof typeof Icon
}
export interface Props {
  bg: string
  title: string
  head: string
  stats: Stat[]
  graphData: LineSeriesPoint[]
}
export function Card({ title, head, stats, bg, graphData }: Props) {
  return (
    <div className={styles.wrapper} style={{ width: 1200, height: 630, background: bg }}>
      <div className={styles.head}>{head}</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.graph}>
        <XYPlot width={550} height={350}>
          <GradientDefs>
            <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity={1} />
              <stop offset="100%" stopColor="white" stopOpacity={0} />
            </linearGradient>
          </GradientDefs>
          <AreaSeries stroke="none" fill="url(#CoolGradient)" data={graphData.map((point) => ({ ...point, y0: 0 }))} />
          <LineSeries className={styles.stroke} stroke="white" data={graphData.map((point) => ({ ...point, y0: 0 }))} />
        </XYPlot>
      </div>
      {stats.map(({ name, value, icon }) => {
        const IconComp = icon && Icon[icon]
        return (
          <div key={name} className={styles.statWrapper}>
            <div className={styles.statTitle}>{name}</div>
            <div className={styles.statValue}>
              {value}
              {IconComp && <IconComp className={styles.icon} />}
            </div>
          </div>
        )
      })}
    </div>
  )
}
