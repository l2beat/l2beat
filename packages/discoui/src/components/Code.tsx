import { cn } from '../utils/cn'

type Props = {
  content: string
  className?: string
}

export function Code({ content, className }: Props) {
  return (
    <code
      className={cn(
        'flex overflow-y-auto rounded-sm border border-coffee-600 bg-coffee-800 px-2.5 py-1.5 font-mono text-coffee-200 text-xs',
        className,
      )}
    >
      <pre>{content}</pre>
    </code>
  )
}

export function InlineCode({ content, className }: Props) {
  return (
    <code
      className={cn(
        'max-w-fit rounded-sm bg-coffee-600 px-1.5 py-0.5 text-2xs text-coffee-200',
        className,
      )}
    >
      {content}
    </code>
  )
}
