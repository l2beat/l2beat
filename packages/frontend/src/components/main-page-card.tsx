import { cn } from '~/utils/cn'

interface Props {
  children: React.ReactNode
  className?: string
}

export function MainPageCard({ children, className }: Props) {
  return (
    <div
      // eslint-disable-next-line tailwindcss/no-custom-classname
      className={cn(
        'primary-card bg-surface-primary p-4 md:rounded-xl md:px-6 md:py-5',
        className,
      )}
    >
      {children}
    </div>
  )
}
