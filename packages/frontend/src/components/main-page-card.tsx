import { cn } from '~/utils/cn'

interface Props {
  children: React.ReactNode
  className?: string
}

export function MainPageCard({ children, className }: Props) {
  // TODO (summary-v2): add to tailwind config
  return (
    <div
      className={cn(
        'bg-pure-white p-4 dark:bg-[#1F2025] md:rounded-xl md:px-6 md:py-5',
        className,
      )}
    >
      {children}
    </div>
  )
}
