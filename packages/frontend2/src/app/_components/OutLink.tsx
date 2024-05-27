import React from 'react'
import { type PropsFrom } from '~/types/PropsFrom'
import { CustomLink } from './CustomLink'

export function OutLink(props: PropsFrom<typeof CustomLink>) {
  return <CustomLink target="_blank" rel="noreferrer noopener" {...props} />
}
