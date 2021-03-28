import React from 'react'
import styles from '../styles/Home.module.scss'
import TimelineIcon from '@material-ui/icons/Timeline'
import { TVLHistory } from './TVLHistory'
import cx from 'classnames'
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
        onChange={(e) => setFilters(filterBy)}
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

function useScreenElementWith(element: HTMLElement | null) {
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  React.useEffect(() => {
    if (element === null) {
      return
    }
    const handler = () => {
      setRect(element.getBoundingClientRect())
    }
    handler()
    window.addEventListener('resize', handler)

    return () => window.removeEventListener('resize', handler)
  }, [element])
  return rect
}
export function Graph({ data, title }: { data: DataPoint[]; title: string }) {
  const [filtersState, setFilters] = React.useState(Filter.ALL)
  const [wrapper, setWrapper] = React.useState<HTMLElement | null>(null);
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
      <div ref={node => setWrapper(node)} className={styles.title}>
        <TimelineIcon />
        <h3>{title}</h3>
        <div className={styles.filterWrapper}>
          <FilterButton filterBy={Filter.ALL} label="All" setFilters={setFilters} selected={filtersState} />
          <FilterButton filterBy={Filter.NINETY_DAYS} label="90 days" setFilters={setFilters} selected={filtersState} />
          <FilterButton filterBy={Filter.THIRTY_DAYS} label="30 days" setFilters={setFilters} selected={filtersState} />
        </div>
      </div>
      <TVLHistory width={rect?.width} data={filteredData as any} />
    </>
  )
}
