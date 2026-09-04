import type { ReactNode } from 'react'

export function Panel({
  title,
  actions,
  children,
  tight,
  className,
}: {
  title?: ReactNode
  actions?: ReactNode
  children: ReactNode
  tight?: boolean
  className?: string
}) {
  return (
    <div className={`panel ${tight ? 'tight' : ''} ${className ?? ''}`}>
      {title !== undefined && (
        <div className="panel-title">
          <span>{title}</span>
          {actions && <span className="row">{actions}</span>}
        </div>
      )}
      <div className="panel-body">{children}</div>
    </div>
  )
}

export function Callout({
  kind = 'info',
  children,
}: {
  kind?: 'info' | 'warn' | 'ok' | 'plain'
  children: ReactNode
}) {
  return (
    <div className={`callout ${kind === 'info' ? '' : kind}`}>{children}</div>
  )
}

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="stat">
      <span className="v">{value}</span>
      <span className="l">{label}</span>
    </div>
  )
}

export const ms = (n: number) => `${n < 10 ? n.toFixed(1) : n.toFixed(0)} ms`
export const kib = (n: number) => `${(n / 1024).toFixed(1)} KiB`
