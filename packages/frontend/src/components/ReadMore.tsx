import type React from 'react'
import { useState } from 'react'
import { cn } from '~/utils/cn'

export interface ReadMoreProps {
  children: string
  maxLength?: number
  onlyOnMobile?: boolean
}

export function ReadMore(props: ReadMoreProps) {
  const maxLength = (props.maxLength ?? 260) - 3

  const alwaysVisible =
    props.children.length > maxLength
      ? props.children.slice(0, maxLength).split(' ').slice(0, -1).join(' ')
      : props.children
  const collapsible = props.children.slice(alwaysVisible.length)

  if (!collapsible) {
    return <>{props.children}</>
  }

  return (
    <CustomReadMore
      alwaysVisible={alwaysVisible}
      collapsible={collapsible}
      onlyOnMobile={props.onlyOnMobile}
    />
  )
}

interface CustomReadMoreProps {
  alwaysVisible: React.ReactNode
  collapsible: React.ReactNode
  onlyOnMobile?: boolean
}

function CustomReadMore({
  alwaysVisible,
  collapsible,
  onlyOnMobile,
}: CustomReadMoreProps) {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <span className="group" data-collapsed={collapsed}>
      {alwaysVisible}
      <span
        className={cn(
          'group-data-[collapsed=false]:hidden',
          onlyOnMobile && 'md:hidden',
        )}
      >
        ...
      </span>
      <span
        className={cn(
          'hidden group-data-[collapsed=false]:inline',
          onlyOnMobile && 'md:inline',
        )}
      >
        {collapsible}
      </span>
      <span className={cn(onlyOnMobile && 'md:hidden')}> </span>
      <button
        className={cn('cursor-pointer underline', onlyOnMobile && 'md:hidden')}
        onClick={() => setCollapsed((collapsed) => !collapsed)}
      >
        <span className="group-data-[collapsed=false]:hidden">Read more</span>
        <span className="hidden group-data-[collapsed=false]:inline">
          Read less
        </span>
      </button>
    </span>
  )
}
