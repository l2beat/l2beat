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
      <span className="lg:hidden group-data-[collapsed=false]:hidden">...</span>
      <span
        className="hidden lg:inline group-data-[collapsed=false]:inline"
        data-role="read-more-collapsible"
      >
        {collapsible}
      </span>
      <span
        data-role="read-more-toggle"
        className="lg:hidden group-data-[collapsed=false]:hidden underline"
      >
        {' '}
        Read more
      </span>
    </span>
  )
}
