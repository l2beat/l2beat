import { Callout } from '~/components/Callout'
import { ShieldIcon } from '~/icons/Shield'
import { cn } from '~/utils/cn'
import { CONTRACTS_UPDATED_NOTE } from '../sectionCopy'

export function ContractsUpdated() {
  return (
    <Callout
      className="my-2 p-4"
      color="yellow"
      icon={
        <ShieldIcon
          className={cn('size-5 fill-yellow-700 dark:fill-yellow-300')}
        />
      }
      body={
        <div className="text-paragraph-15 md:text-paragraph-16">
          <strong>Note:</strong> {CONTRACTS_UPDATED_NOTE}
        </div>
      }
    />
  )
}
