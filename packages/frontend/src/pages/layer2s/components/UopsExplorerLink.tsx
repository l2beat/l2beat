import { useTracking } from '~/hooks/useTracking'
import { cn } from '~/utils/cn'

export function UopsExplorerLink() {
  const { track } = useTracking()
  return (
    <a
      href="https://tools.l2beat.com/uops"
      target="_blank"
      rel="noreferrer"
      className={cn(
        'flex w-fit items-center gap-1 rounded-lg bg-brand px-2 py-1 font-semibold text-sm text-white max-md:ml-4',
        'ring-brand ring-offset-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2',
      )}
      onClick={() => {
        track('uopsExplorerSelected')
      }}
    >
      <span>🔍</span>
      <span>UOPS Explorer</span>
    </a>
  )
}
