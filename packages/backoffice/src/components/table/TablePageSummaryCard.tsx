import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { cn } from '~/utils/cn'

interface TablePageSummaryCardProps {
  title: string
  description?: ReactNode
  actions?: ReactNode
  summary?: ReactNode
  className?: string
}

export function TablePageSummaryCard({
  title,
  description,
  actions,
  summary,
  className,
}: TablePageSummaryCardProps) {
  return (
    <Card className={cn('gap-3 py-4', className)}>
      <CardHeader className="flex flex-col gap-3 px-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-0.5">
          <CardTitle>{title}</CardTitle>
          {description ? (
            <CardDescription className="text-xs leading-4">
              {description}
            </CardDescription>
          ) : null}
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </CardHeader>

      {summary ? (
        <CardContent className="flex flex-wrap gap-1.5 px-4">
          {summary}
        </CardContent>
      ) : null}
    </Card>
  )
}
