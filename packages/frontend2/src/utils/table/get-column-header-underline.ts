import { cn } from '../cn'

export function getColumnHeaderUnderline(...classNames: string[]) {
  return cn(
    'relative before:absolute',
    'before:inset-x-3 before:h-0.5',
    'before:bottom-px',
    'before:rounded-t-full',
    ...classNames,
  )
}
