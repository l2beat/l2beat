import { StageBadge } from '~/components/badge/stage-badge'
import type { FilterableValueId } from './filterable-value'
import { filterValuesSortFn } from './filterable-value'
import { filterIdToValues } from './filterable-value'

interface Props {
  values: string[]
  filterId: FilterableValueId
}

/**
 * A component to handle custom display for different filter values.
 * It provides specialized rendering for specific value types (like stages)
 * and falls back to simple text representation for other values.
 *
 * For multiple values, it shows a count with the appropriate label.
 * For stage values, it renders them as badges on larger screens and as text on mobile.
 */
export function TableFilterValue({ values, filterId }: Props) {
  const value =
    values.length > 1
      ? `${values.length} ${filterIdToValues[filterId]}`
      : values[0]

  if (
    values.every(
      (value) =>
        value === 'Stage 0' || value === 'Stage 1' || value === 'Stage 2',
    )
  ) {
    return (
      <div>
        <div className="flex gap-1 max-xs:hidden">
          {values.sort(filterValuesSortFn).map((value) => (
            <StageBadge key={value} stage={value} isAppchain={false} />
          ))}
        </div>
        <div className="xs:hidden">{value}</div>
      </div>
    )
  }

  return value
}
