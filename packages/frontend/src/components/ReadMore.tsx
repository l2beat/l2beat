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
    <span className="group" data-role="read-more">
      {alwaysVisible}
      <span className="group-data-[collapsed=false]:hidden md:hidden">...</span>
      <span
        className="hidden group-data-[collapsed=false]:inline md:inline"
        data-role="read-more-collapsible"
      >
        {collapsible}
      </span>
      <span className="md:hidden"> </span>
      <button
        data-role="read-more-toggle"
        className="cursor-pointer underline md:hidden"
      >
        <span className="group-data-[collapsed=false]:hidden">Read more</span>
        <span className="hidden group-data-[collapsed=false]:inline">
          Read less
        </span>
      </button>
    </span>
  )
}
