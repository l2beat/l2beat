'use client'

import { cn } from '~/utils/cn'
import { CustomLink, type CustomLinkProps } from '../custom-link'
import { useHiglightableLinkContext } from './highlightable-link-context'

export function HighlightableLink({ className, ...props }: CustomLinkProps) {
  const { current, setCurrent } = useHiglightableLinkContext()

  return (
    <CustomLink
      {...props}
      className={cn(
        className,
        current === props.href && [
          'relative z-10',
          'before:absolute before:-inset-x-1 before:-inset-y-0.5',
          'before:-z-10 before:rounded-sm before:border',
          'before:bg-yellow-250/50 before:border-dashed before:border-yellow-700 before:content-[""]',
          'dark:before:border-yellow-250 dark:before:bg-yellow-250/10',
        ],
      )}
      onMouseEnter={() => setCurrent(props.href)}
      onMouseLeave={() => setCurrent(undefined)}
    />
  )
}
