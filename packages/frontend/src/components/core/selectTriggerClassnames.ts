import { cn } from '~/utils/cn'

// Apart from Select.tsx, so a trigger styled like a select doesn't load
// Radix's select, which would put the page on a chunk split of its own.
export const selectTriggerClassnames = cn(
  'group/trigger flex min-h-8 select-none items-center justify-between gap-1.5 whitespace-nowrap rounded-lg px-3 py-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
  'bg-surface-primary font-medium text-xs leading-none data-[state=open]:hover:bg-surface-secondary md:text-sm',
  'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
  'z-20 transition-colors',
)
