'use client'
import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps } from 'react'
import {
  HighlightedPrimaryCardProvider,
  useHighlightedPrimaryCardContext,
} from '~/components/primary-card/highlighted-primary-card-context'
import { cn } from '~/utils/cn'

export function PrimaryCard(
  props: ComponentProps<'div'> & { asChild?: boolean },
) {
  return (
    <HighlightedPrimaryCardProvider>
      <Content {...props} />
    </HighlightedPrimaryCardProvider>
  )
}

function Content({
  children,
  className,
  asChild,
  ...props
}: ComponentProps<'div'> & { asChild?: boolean }) {
  const Component = asChild ? Slot : 'div'
  const { highlightedId } = useHighlightedPrimaryCardContext()
  return (
    <Component
      className={cn(
        'group/primary-card relative bg-surface-primary p-4 primary-card md:rounded-xl md:px-6 md:py-5',
        'before:absolute before:inset-0 before:transition-all before:duration-300 before:md:rounded-xl',
        highlightedId &&
          props.id === highlightedId &&
          'before:border-2 before:border-brand before:shadow-[0px_4px_12px_10px] before:shadow-[#FF5FFB40]',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
