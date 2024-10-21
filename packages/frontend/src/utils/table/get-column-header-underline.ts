import { cn } from '../cn'

export function getColumnHeaderUnderline(...classNames: string[]) {
  return cn(
    'relative before:absolute',
    'before:left-3 before:right-0 before:h-0.5',
    'before:bottom-0',
    'before:rounded-t-full',
    ...classNames,
  )
}
