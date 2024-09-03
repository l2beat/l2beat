import React from 'react'
import { CustomLink, type CustomLinkProps } from './link/custom-link'

export function OutLink(props: CustomLinkProps) {
  return <CustomLink target="_blank" rel="noreferrer noopener" {...props} />
}
