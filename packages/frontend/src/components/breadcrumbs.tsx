import Link from 'next/link'
import React from 'react'
import type { ReactNode } from 'react'
import { ChevronIcon } from '~/icons/chevron'
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
        'flex select-none items-center gap-2 text-base font-medium text-secondary',
        className,
      )}
    >
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <BreadcrumbItem href={item.href} className="last:text-primary">
            {item.content}
          </BreadcrumbItem>
          {i < items.length - 1 && (
            <ChevronIcon className="size-2.5   -rotate-90 fill-current" />
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
}: { href?: string; children: ReactNode; className?: string }) {
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }
  return <div className={className}>{children}</div>
}
