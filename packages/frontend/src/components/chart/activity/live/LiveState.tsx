import { LiveIndicator } from '~/components/LiveIndicator'

/** Whether the live view follows the newest block, leading back to it when not */
export function LiveState({
  following,
  onFollow,
}: {
  following: boolean
  onFollow: () => void
}) {
  if (following) {
    return (
      <span className="flex items-center gap-1.5 font-medium text-brand-deep text-xs uppercase">
        <LiveIndicator color="var(--brand)" className="ml-0 shrink-0" />
        Live
      </span>
    )
  }
  return (
    <button
      type="button"
      title="Back to live"
      aria-label="Back to live"
      className="group flex items-center gap-1.5 font-medium text-secondary text-xs uppercase hover:text-brand-deep"
      onClick={onFollow}
    >
      <LiveIndicator disabled color="var(--brand)" className="ml-0 shrink-0" />
      Live
    </button>
  )
}
