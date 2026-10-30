import type { ReactNode } from 'react'

interface Props {
  title: string
  description: ReactNode
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
    <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 md:flex-1">
        <div className="flex items-center gap-1.5">
          {icon}
          <h2 className="font-bold text-heading-16 md:text-heading-20">
            {title}
          </h2>
          {count !== undefined && (
            <span className="ml-0.5 font-medium text-label-value-14 text-secondary md:text-label-value-15">
              {count}
            </span>
          )}
        </div>
        <p className="mt-1 text-paragraph-14 text-secondary md:text-paragraph-15">
          {description}
        </p>
      </div>
      {children}
    </div>
  )
}
