import TimelineIcon from '@material-ui/icons/Timeline'
import cx from 'classnames'
import React, { ReactElement } from 'react'

import styles from '../../styles/Home.module.scss'
import { useScreenElementWith } from '../../utils/useScreenElementWith'
export enum Filter {
  ALL,
  NINETY_DAYS,
  THIRTY_DAYS,
}

export const FilterButton = ({
  label,
  filterBy,
  setFilters,
  selected,
}: {
  label: string
  selected: Filter
  filterBy: Filter
  setFilters: (filter: Filter) => void
}) => {
  return (
    <label className={cx(styles.filter, { [styles.filterSelected]: filterBy === selected })}>
      <input
        checked={filterBy === selected}
        onChange={() => setFilters(filterBy)}
        type="radio"
        className={styles.filterInput}
      />
      <div>{label}</div>
    </label>
  )
}

const DAY_IN_MILLIS = 24 * 60 * 60 * 1000
export const NINETY_DAYS_IN_MILLIS = 90 * DAY_IN_MILLIS
export const THIRTY_DAYS_IN_MILLIS = 30 * DAY_IN_MILLIS

interface DataPoint {
  x: Date
  y: number
}

interface GraphProps {
  data: DataPoint[]
  title: string
  children: (data: any[], container: DOMRect | null) => ReactElement
  icon?: ReactElement
}

export const Graph: React.FC<GraphProps> = ({ data, title, children, icon }) => {
  const [filtersState, setFilters] = React.useState(Filter.ALL)
  const [wrapper, setWrapper] = React.useState<HTMLElement | null>(null)
  const rect = useScreenElementWith(wrapper)

  const filteredData = React.useMemo(
    () =>
      data.filter(({ x }) => {
        const currentTime = Date.now()

        switch (filtersState) {
          case Filter.ALL:
            return true
          case Filter.NINETY_DAYS:
            return x.getTime() > currentTime - NINETY_DAYS_IN_MILLIS
          case Filter.THIRTY_DAYS:
            return x.getTime() > currentTime - THIRTY_DAYS_IN_MILLIS
        }
      }),
    [data, filtersState],
  )

  return (
    <>
      <div ref={(node) => setWrapper(node)} className={styles.title}>
        {icon}
        <h3>{title}</h3>
        <div className={styles.filterWrapper}>
          <FilterButton filterBy={Filter.ALL} label="All" setFilters={setFilters} selected={filtersState} />
          <FilterButton filterBy={Filter.NINETY_DAYS} label="90 days" setFilters={setFilters} selected={filtersState} />
          <FilterButton filterBy={Filter.THIRTY_DAYS} label="30 days" setFilters={setFilters} selected={filtersState} />
        </div>
      </div>
      {children(filteredData, rect)}
    </>
  )
}

Graph.defaultProps = {
  icon: <TimelineIcon />,
}
