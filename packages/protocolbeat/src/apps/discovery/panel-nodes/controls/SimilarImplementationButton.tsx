import { clsx } from 'clsx'
import { useCallback } from 'react'
import { IconCopy } from '../../../../icons/IconCopy'
import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function SimilarImplementationButton({
  className,
}: {
  className?: string
}) {
  const enabled = useStore(
    (state) => state.userPreferences.highlightSimilarImplementation,
  )
  const setPreferences = useStore((state) => state.setPreferences)

  const toggle = useCallback(() => {
    setPreferences({ highlightSimilarImplementation: !enabled })
  }, [enabled, setPreferences])

  return (
    <ControlButton
      onClick={toggle}
      aria-pressed={enabled}
      title="Highlight nodes that share the same source code or value shape as the selected node"
      aria-label="Toggle similar implementation highlight"
      className={clsx(
        'gap-2',
        enabled &&
          'border-autumn-300 bg-autumn-300 text-black hover:bg-autumn-200',
        className,
      )}
    >
      <span className="flex items-center justify-center gap-2 text-center">
        <IconCopy />
        <span className="text-[11px] leading-none">Similar</span>
      </span>
    </ControlButton>
  )
}
