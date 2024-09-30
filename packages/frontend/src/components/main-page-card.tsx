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
        'rounded-xl bg-pure-white px-6 py-5 dark:bg-[#1F2025]',
        className,
      )}
    >
      {children}
    </div>
  )
}
