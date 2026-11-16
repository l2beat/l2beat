import { ACTION_BUTTON_CLASS } from '~/components/core/actionButtonClassNames'
import { useTracking } from '~/hooks/useTracking'
import { cn } from '~/utils/cn'

export function UopsExplorerLink() {
  const { track } = useTracking()
  return (
    <a
      href="https://tools.ethbeat.org/uops"
      target="_blank"
      rel="noreferrer"
      className={cn(ACTION_BUTTON_CLASS, 'max-md:ml-4')}
      onClick={() => {
        track('uopsExplorerSelected')
      }}
    >
      UOPS Explorer
    </a>
  )
}
