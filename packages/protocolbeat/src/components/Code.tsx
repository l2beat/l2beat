import { cn } from '../utils/cn'

type Props = {
  content: string
  className?: string
}

export function Code({ content, className }: Props) {
  return (
    <code
      className={cn(
        'flex overflow-y-auto border border-coffee-400 bg-coffee-700 px-2 py-1 text-2xs text-coffee-400',
        className,
      )}
    >
      <pre>{content}</pre>
    </code>
  )
}
