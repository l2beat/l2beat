import { ReactElement } from 'react'

export interface Page {
  slug: string
  page: ReactElement
}

export interface Wrapped<Props> {
  props: Props
  wrapper: WrapperProps
}

export interface WrapperProps {
  htmlClassName?: string
  metadata: PageMetadata
  preloadApi?: string
}

export interface PageMetadata {
  title: string
  description: string
  image: string
  url: string
}
