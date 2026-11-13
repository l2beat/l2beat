/**
 * "Top 5" beside a card title, as quiet as the period subtitles: 13px
 * secondary text on the title's baseline.
 */
export function TopNBadge({ n }: { n: number }) {
  return (
    <span className="shrink-0 whitespace-nowrap font-normal text-label-value-13 text-secondary leading-4">
      Top {n}
    </span>
  )
}
