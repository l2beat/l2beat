import React from 'react'

import { cn } from '../utils/cn'
import { ContentWrapper } from './content-wrapper'

interface Props {
  children: React.ReactNode
  className?: string
  contentWrapperClassName?: string
}

export function FullPageHeader(props: Props) {
  return (
    <header
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
    </header>
  )
}
