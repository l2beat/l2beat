import React, { type ComponentProps } from 'react'
import { CustomLink } from './link/custom-link'

export function OutLink(props: ComponentProps<typeof CustomLink>) {
  return <CustomLink target="_blank" rel="noreferrer noopener" {...props} />
}
