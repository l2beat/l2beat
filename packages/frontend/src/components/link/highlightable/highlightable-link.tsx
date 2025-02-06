'use client'

import { cn } from '~/utils/cn'
import type { CustomLinkProps } from '../custom-link'
import { CustomLink } from '../custom-link'
import { useHiglightableLinkContext } from './highlightable-link-context'

export type HighlightableLinkProps = {
  address: string
} & CustomLinkProps

export function HighlightableLink({
  className,
  ...props
}: HighlightableLinkProps) {
  const { current, setCurrent } = useHiglightableLinkContext()

  return (
    <CustomLink
      {...props}
      className={cn(
        className,
        current === props.address && [
          'relative z-10',
          'before:absolute before:-inset-x-1 before:-inset-y-0.5',
          'before:-z-10 before:rounded before:border',
          'before:border-dashed before:border-yellow-700 before:bg-yellow-250/50 before:content-[""]',
          'before:dark:border-yellow-250 before:dark:bg-yellow-250/10',
        ],
      )}
      onMouseEnter={() => setCurrent(props.address)}
      onMouseLeave={() => setCurrent(undefined)}
    />
  )
}
