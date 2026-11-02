import { linkVariants } from '../link/CustomLink'

/** Styled like `TableEmptyState`, so a failed fetch takes its place. */
export function TableLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mt-2 flex flex-col items-center justify-center rounded-lg bg-blue-700/15 py-10">
      <span className="mb-4 font-medium text-2xl">Could not load</span>
      <span className="mb-6">
        Something went wrong while loading this table
      </span>
      <button
        onClick={onRetry}
        className={linkVariants({ variant: 'primary' })}
      >
        Try again
      </button>
    </div>
  )
}
