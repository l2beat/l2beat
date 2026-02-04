export function TopNBadge({ n }: { n: number }) {
  return (
    <div className="rounded-sm bg-surface-secondary px-1.5 pt-1 pb-1 font-medium text-secondary text-xs leading-none md:px-2.5 md:pt-1.5 md:font-semibold md:text-base md:leading-[115%]">
      TOP {n}
    </div>
  )
}
