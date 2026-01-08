import { cn } from '~/utils/cn'
import { Banner } from './Banner'

export function TrackedTxsOutageNotice({
  className,
  mobileFull,
  type,
}: {
  type: 'section' | 'page'
  className?: string
  mobileFull?: boolean
}) {
  return (
    <Banner
      type="warning"
      className={cn(
        'mt-2 mb-2',
        mobileFull && 'max-md:rounded-none max-md:border-x-0',
        className,
      )}
    >
      Data {type === 'page' ? 'on this page' : 'in this section'} may be
      temporarily out of date due to third-party provider issues. We&apos;re
      working to resolve this.
    </Banner>
  )
}
