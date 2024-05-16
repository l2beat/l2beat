import { ClassNameValue } from 'tailwind-merge'
import { cn } from '~/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: ClassNameValue
}

export function Card(props: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-zinc-900 rounded-xl p-6',
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}
