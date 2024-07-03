import React from 'react'

export interface ReadMoreProps {
  children: string
  maxLength?: number
}

export function ReadMore({
  children,
  maxLength: maxChildrenLength = 260,
}: ReadMoreProps) {
  // Accounting for the ellipsis
  const maxLength = maxChildrenLength - 3

  const alwaysVisible =
    children.length > maxLength
      ? children.slice(0, maxLength).split(' ').slice(0, -1).join(' ')
      : children
  const collapsible = children.slice(alwaysVisible.length)

  if (!collapsible) {
    return <>{children}</>
  }

  return (
    <CustomReadMore alwaysVisible={alwaysVisible} collapsible={collapsible} />
  )
}

export interface CustomReadMoreProps {
  alwaysVisible: React.ReactNode
  collapsible: React.ReactNode
}

export function CustomReadMore({
  alwaysVisible,
  collapsible,
}: CustomReadMoreProps) {
  return (
    <span data-role="read-more">
      {alwaysVisible}
      <span className="group-data-[collapsed=false]:hidden lg:hidden">...</span>
      <span
        className="hidden group-data-[collapsed=false]:inline lg:inline"
        data-role="read-more-collapsible"
      >
        {collapsible}
      </span>
      <span
        data-role="read-more-toggle"
        className="underline group-data-[collapsed=false]:hidden lg:hidden"
      >
        {' '}
        Read more
      </span>
    </span>
  )
}
