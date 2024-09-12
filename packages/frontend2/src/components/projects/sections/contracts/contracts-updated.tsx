import { Callout } from '~/components/callout'
import { ShieldIcon } from '~/icons/shield'
import { cn } from '~/utils/cn'

export function ContractsUpdated() {
  return (
    <Callout
      className="my-2 p-4"
      color="yellow"
      icon={
        <ShieldIcon className={cn('fill-yellow-700 dark:fill-yellow-300')} />
      }
      body={
        <div>
          <strong>Note:</strong> Contracts presented in this section had their
          implementations updated since the last time our team looked at this
          project. The information presented may be inaccurate.
        </div>
      }
    />
  )
}
