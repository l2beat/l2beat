import React, { AnchorHTMLAttributes } from 'react'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  allowReferrer?: boolean
}

export function OutLink({ allowReferrer, ...props }: Props) {
  const rel = allowReferrer ? 'noopener' : 'noopener noreferrer'
  return <a rel={rel} target="_blank" {...props} />
}
