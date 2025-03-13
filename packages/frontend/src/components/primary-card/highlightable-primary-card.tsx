'use client'
import type { ComponentProps } from 'react'
import {
  HighlightedPrimaryCardProvider,
  useHighlightedPrimaryCardContext,
} from '~/components/primary-card/highlighted-primary-card-context'
import { cn } from '~/utils/cn'
import { PrimaryCard } from './primary-card'

export function HighlightablePrimaryCard(
  props: ComponentProps<typeof PrimaryCard>,
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
  ...props
}: ComponentProps<typeof PrimaryCard>) {
  const { highlightedId } = useHighlightedPrimaryCardContext()
  return (
    <PrimaryCard
      className={cn(
        'relative transition-all duration-300',
        highlightedId &&
          props.id === highlightedId &&
          'md:z-10 md:shadow-[0px_4px_12px_10px] md:shadow-[#FF5FFB40] md:ring-2 md:ring-brand',
        className,
      )}
      {...props}
    >
      {children}
    </PrimaryCard>
  )
}
