import React, { type ComponentProps } from 'react'
import { CustomLink } from './custom-link'

export function OutLink(props: ComponentProps<typeof CustomLink>) {
  return <CustomLink target="_blank" rel="noreferrer noopener" {...props} />
}
