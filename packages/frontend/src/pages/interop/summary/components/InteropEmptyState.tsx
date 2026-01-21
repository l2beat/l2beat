import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EmptyStateIcon } from '~/icons/EmptyState'
import { ChainSelectorResetButton } from './chain-selector/ChainSelectorResetButton'

interface Props {
  isDirty: boolean
}

export function InteropEmptyState({ isDirty }: Props) {
  return (
    <PrimaryCard className="mt-5 mb-12 flex w-full grow items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <EmptyStateIcon className="size-9 fill-yellow-700 dark:fill-yellow-200" />
        <span className="mt-4 text-heading-24">
          No data for selected chains
        </span>
        <span className="mt-4 mb-6 font-medium text-label-value-16 text-secondary">
          We couldn&apos;t find data for this path. Select another route or
          adjust your filters.
        </span>
        {isDirty && <ChainSelectorResetButton />}
      </div>
    </PrimaryCard>
  )
}
