import { useTracking } from '~/hooks/useTracking'
import { cn } from '~/utils/cn'

export function UopsExplorerLink() {
  const { track } = useTracking()
  return (
    <a
      href="https://uops.l2beat.com/"
      target="_blank"
      rel="noreferrer"
      className={cn(
        'flex w-fit items-center gap-1 rounded-lg bg-linear-to-r from-purple-100 to-pink-100 px-2 py-1 font-semibold text-sm text-white max-md:ml-4',
        'ring-brand ring-offset-1 ring-offset-background focus:outline-none focus:ring-2',
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
