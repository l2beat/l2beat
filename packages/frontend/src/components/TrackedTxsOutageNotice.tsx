import { cn } from '~/utils/cn'
import { Banner } from './Banner'
import { trackedTxsOutageText } from './projects/sections/sectionCopy'

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
      {trackedTxsOutageText(type)}
    </Banner>
  )
}
