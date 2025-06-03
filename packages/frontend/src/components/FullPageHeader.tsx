import type React from 'react'

import { cn } from '~/utils/cn'
import { ContentWrapper } from './ContentWrapper'

interface Props {
  children: React.ReactNode
  className?: string
  contentWrapperClassName?: string
  as?: 'header' | 'div'
}

export function FullPageHeader(props: Props) {
  const Comp = props.as ?? 'header'

  return (
    <Comp
      className={cn(
        'border-divider border-b bg-header-primary pt-12 pb-8 md:py-24',
        props.className,
      )}
    >
      <ContentWrapper
        className={cn(
          'flex items-center justify-center',
          props.contentWrapperClassName,
        )}
      >
        {props.children}
      </ContentWrapper>
    </Comp>
  )
}
