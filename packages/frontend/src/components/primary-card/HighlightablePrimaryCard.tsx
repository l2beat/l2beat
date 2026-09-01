import type { ComponentProps } from 'react'
import {
  HighlightedPrimaryCardProvider,
  useHighlightedPrimaryCardContext,
} from '~/components/primary-card/HighlightedPrimaryCardContext'
import { cn } from '~/utils/cn'
import { PrimaryCard } from './PrimaryCard'

interface Props extends ComponentProps<typeof PrimaryCard> {
  nested?: boolean
}

export function HighlightablePrimaryCard(props: Props) {
  return (
    <HighlightedPrimaryCardProvider>
      <Content {...props} />
    </HighlightedPrimaryCardProvider>
  )
}

function Content({ children, className, nested, ...props }: Props) {
  const { highlightedId } = useHighlightedPrimaryCardContext()
  const isHighlighted = highlightedId && props.id === highlightedId
  return (
    <PrimaryCard
      className={cn(
        'relative transition-shadow duration-300',
        isHighlighted &&
          'md:z-10 md:shadow-[0px_4px_12px_10px] md:shadow-n-pink-350 md:ring-2 md:ring-brand',
        nested && isHighlighted && 'md:ring-offset-8',
        className,
      )}
      {...props}
    >
      {children}
    </PrimaryCard>
  )
}
