import { type ClassNameValue } from 'tailwind-merge'
import { cn } from '~/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: ClassNameValue
}

export function Card(props: CardProps) {
  return (
    <div
      className={cn(
        'w-full rounded-xl bg-white p-6 dark:bg-zinc-900',
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}
