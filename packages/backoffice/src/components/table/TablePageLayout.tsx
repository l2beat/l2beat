import type { ReactNode } from 'react'
import { Card, CardContent } from '~/components/core/Card'
import { AppLayout } from '~/layouts/AppLayout'
import { cn } from '~/utils/cn'
import { TablePageSummaryCard } from './TablePageSummaryCard'

interface TablePageLayoutProps {
  title: string
  description?: ReactNode
  actions?: ReactNode
  summary: ReactNode
  children: ReactNode
  className?: string
}

export function TablePageLayout({
  title,
  description,
  actions,
  summary,
  children,
  className,
}: TablePageLayoutProps) {
  return (
    <AppLayout
      className="h-[calc(100svh-var(--spacing-environment-banner))] overflow-hidden"
      contentClassName="min-h-0 flex-1 overflow-hidden"
    >
      <div className={cn('flex min-h-0 flex-1 flex-col gap-3', className)}>
        <TablePageSummaryCard
          title={title}
          description={description}
          actions={actions}
          summary={summary}
        />

        <Card className="min-h-0 flex-1 gap-0 overflow-hidden py-0">
          <CardContent className="flex min-h-0 flex-1 flex-col px-0">
            {children}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
