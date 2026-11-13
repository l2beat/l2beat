import { useTracking } from '~/hooks/useTracking'
import { cn } from '~/utils/cn'

export function UopsExplorerLink() {
  const { track } = useTracking()
  return (
    <a
      href="https://tools.ethbeat.org/uops"
      target="_blank"
      rel="noreferrer"
      className={cn(
        'inline-flex h-8 w-fit items-center whitespace-nowrap rounded-md border border-divider px-3 font-medium text-label-value-13 text-primary leading-4 transition-colors hover:bg-surface-secondary max-md:ml-4',
        'ring-brand ring-offset-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2',
      )}
      onClick={() => {
        track('uopsExplorerSelected')
      }}
    >
      UOPS Explorer
    </a>
  )
}
