import React from 'react'

import { cn } from '~/utils/cn'
import { ContentWrapper } from './content-wrapper'

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
      className={cn('bg-pure-white py-24 dark:bg-zinc-900', props.className)}
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
