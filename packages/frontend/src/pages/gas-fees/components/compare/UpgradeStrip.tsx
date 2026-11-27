import { CustomLink } from '~/components/link/CustomLink'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import { formatDate } from '../../utils/format'
import type { UpgradeSelection } from './useUpgradeSelection'

/** The hovered or selected upgrade, else the next one, with arrows stepping through them */
export function UpgradeStrip({
  selection,
  earlier,
  onShowAll,
}: {
  selection: UpgradeSelection
  /** Upgrades before the range */
  earlier: number
  onShowAll: () => void
}) {
  const { shown } = selection
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface-secondary px-3 py-2 text-sm">
      <div className="flex shrink-0 gap-1">
        <StepButton direction={-1} selection={selection} />
        <StepButton direction={1} selection={selection} />
      </div>
      <p className="min-w-0 flex-1">
        <CustomLink href={shown.url} className="font-semibold">
          {shown.title}
        </CustomLink>{' '}
        <span className="font-medium">
          {'timestamp' in shown
            ? formatDate(shown.timestamp)
            : 'next, no date set yet'}
        </span>{' '}
        <span className="text-secondary">{shown.summary}</span>
      </p>
      {earlier > 0 && (
        <span className="shrink-0 text-2xs text-secondary">
          {earlier} earlier upgrade{earlier === 1 ? '' : 's'}
          {DOT_SEPARATOR}
          <button
            type="button"
            className="text-link underline"
            onClick={onShowAll}
          >
            show all
          </button>
        </span>
      )}
    </div>
  )
}

function StepButton({
  direction,
  selection,
}: {
  direction: -1 | 1
  selection: UpgradeSelection
}) {
  const enabled = selection.canStep(direction)
  return (
    <button
      type="button"
      aria-label={direction === -1 ? 'Earlier upgrade' : 'Later upgrade'}
      disabled={!enabled}
      onClick={() => selection.step(direction)}
      className={cn(
        'flex size-7 items-center justify-center rounded-md bg-surface-primary',
        !enabled && 'opacity-40',
      )}
    >
      <ChevronIcon
        className={cn(
          'size-3 fill-current',
          direction === -1 ? 'rotate-90' : '-rotate-90',
        )}
      />
    </button>
  )
}
