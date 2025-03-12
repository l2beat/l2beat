import { VerticalSeparator } from '~/components/core/vertical-separator'
import { CloseIcon } from '~/icons/close'
import { useNewTableFilterContext } from './new-table-filter-context'
import type { FilterState } from './use-filter-state'

export function NewTableFilterItem({
  filter,
}: { filter: FilterState[number] }) {
  const { dispatch } = useNewTableFilterContext()
  return (
    <div className="flex h-8 items-center rounded-lg bg-surface-primary text-base font-semibold leading-none">
      <div className="flex h-full items-center justify-center pl-2.5 pr-2">
        {filter.label}
      </div>
      <VerticalSeparator className="h-[30px]" />
      <div className="flex h-full items-center justify-center px-2">
        {conditionLabel(filter)}
      </div>
      <VerticalSeparator className="h-[30px]" />
      <div className="flex h-full items-center justify-center px-2">
        {filter.values.join(', ')}
      </div>
      <VerticalSeparator className="h-[30px]" />
      <button
        className="h-full pl-2 pr-2.5"
        onClick={() => dispatch({ type: 'remove', id: filter.id })}
      >
        <div className="inline-flex size-3 items-center justify-center rounded-sm bg-brand">
          <CloseIcon className="size-2.5 fill-white dark:fill-black dark:group-hover:fill-gray-950" />
        </div>
      </button>
    </div>
  )
}

function conditionLabel(filter: FilterState[number]) {
  if (filter.values.length > 1) {
    return filter.reversed ? 'is not any of' : 'is any of'
  }
  return filter.reversed ? 'is not' : 'is'
}
