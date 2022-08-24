import React from 'react'

import { Page } from '../../components'
import { MetaImage, MetaImageProps } from './MetaImage'

export function MetaImagePage(props: MetaImageProps) {
  return (
    <Page
      htmlClassName="light meta"
      metadata={{ title: 'Meta Image', description: '', image: '', url: '' }}
      preloadApi={props.apiEndpoint}
    >
      <MetaImage {...props} />
    </Page>
  )
}
