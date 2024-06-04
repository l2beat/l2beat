import React, { type AnchorHTMLAttributes } from 'react'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  allowReferrer?: boolean
}

export function PlainLink({ allowReferrer, ...props }: Props) {
  const isOutLink = props.href?.startsWith('http')

  const rel = isOutLink
    ? allowReferrer
      ? 'noopener'
      : 'noopener noreferrer'
    : undefined
  return <a rel={rel} target={isOutLink ? '_blank' : undefined} {...props} />
}
