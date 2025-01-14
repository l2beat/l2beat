import { cn } from '~/utils/cn'

interface Props {
  children: React.ReactNode
  className?: string
}

export function PrimaryCard({ children, className }: Props) {
  return (
    <div
      className={cn(
        'bg-surface-primary p-4 primary-card md:rounded-xl md:px-6 md:py-5',
        className,
      )}
    >
      {children}
    </div>
  )
}
