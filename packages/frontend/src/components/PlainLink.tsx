import React, { AnchorHTMLAttributes } from 'react'

import { isOutLink } from '../utils/isOutLink'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  allowReferrer?: boolean
}

export function PlainLink({ allowReferrer, ...props }: Props) {
  const rel = isOutLink(props.href)
    ? allowReferrer
      ? 'noopener'
      : 'noopener noreferrer'
    : undefined
  return (
    <a
      rel={rel}
      target={isOutLink(props.href) ? '_blank' : undefined}
      {...props}
    />
  )
}
