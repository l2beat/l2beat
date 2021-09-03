import React, { AnchorHTMLAttributes } from 'react'

export function OutLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a rel="noopener noreferrer" target="_blank" {...props} />
}
