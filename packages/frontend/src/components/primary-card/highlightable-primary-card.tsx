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
      data-highlighted={highlightedId && props.id === highlightedId}
      className={cn(
        'relative transition-all duration-300',
        'data-[highlighted=true]:z-10 data-[highlighted=true]:shadow-[0px_4px_12px_10px] data-[highlighted=true]:shadow-[#FF5FFB40] data-[highlighted=true]:ring-2 data-[highlighted=true]:ring-brand max-md:data-[highlighted=true]:ring-inset',
        className,
      )}
      {...props}
    >
      {children}
    </PrimaryCard>
  )
}
