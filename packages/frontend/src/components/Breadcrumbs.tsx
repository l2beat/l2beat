import type { ReactNode } from 'react'
import React from 'react'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'

interface Item {
  content: ReactNode
  href?: string
}

interface Props {
  items: Item[]
  className?: string
}

export function Breadcrumbs({ items, className }: Props) {
  return (
    <nav
      className={cn(
        'flex select-none items-center gap-2 font-medium text-base text-secondary',
        className,
      )}
    >
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <BreadcrumbItem href={item.href} className="last:text-primary">
            {item.content}
          </BreadcrumbItem>
          {i < items.length - 1 && (
            <ChevronIcon className="-rotate-90 size-2.5 fill-current" />
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

function BreadcrumbItem({
  href,
  children,
  className,
}: {
  href?: string
  children: ReactNode
  className?: string
}) {
  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  return <div className={className}>{children}</div>
}
