import type { ReactNode } from 'react'

interface Props {
  title: string
  description?: ReactNode
  icon?: ReactNode
  count?: number
  /** Table controls, aligned to the right on wider screens. */
  children?: ReactNode
}

/** Heads one of several tables that share a page. */
export function TableSectionHeader({
  title,
  description,
  icon,
  count,
  children,
}: Props) {
  return (
    <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0 md:flex-1">
        <div className="flex items-center gap-1.5">
          {icon}
          <h2 className="font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
            {title}
          </h2>
          {count !== undefined && (
            <span className="ml-0.5 font-normal text-label-value-13 text-secondary leading-4">
              {count}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-pretty text-label-value-15 text-secondary leading-5.5">
            {description}
          </p>
        )}
      </div>
      {/* Pulled up 4px so a 32px control centres on the 24px title line,
          whether or not a description follows. */}
      {children && <div className="md:-my-1 md:shrink-0">{children}</div>}
    </div>
  )
}
