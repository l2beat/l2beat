import React from 'react'

export interface ReadMoreProps {
  children: string
  maxLength?: number
}

export function ReadMore({ children, maxLength = 160 }: ReadMoreProps) {
  const alwaysVisible = children
    // Accounting for the ellipsis
    .slice(0, maxLength - 3)
    .split(' ')
    .slice(0, -1)
    .join(' ')
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
      <span data-role="read-more-indicator">...</span>
      <span style={{ display: 'none' }} data-role="read-more-collapsible">
        {collapsible}
      </span>{' '}
      <span data-role="read-more-toggle" className="underline">
        Read more
      </span>
    </span>
  )
}
