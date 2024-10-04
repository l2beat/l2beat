import { cn } from '../cn'

export function getColumnHeaderUnderline(...classNames: string[]) {
  return cn(
    'relative before:absolute',
    'before:inset-x-3 before:h-0.5',
    'before:bottom-0',
    'before:rounded-t-full',
    ...classNames,
  )
}
