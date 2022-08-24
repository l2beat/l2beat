import React from 'react'

import { Analytics } from './Analytics'
import { Favicons } from './Favicons'
import { MetaTags } from './MetaTags'
import { Preload } from './Preload'

interface Props {
  title: string
  description: string
  image: string
  url: string
  preloadApi?: string
}

export function Head(props: Props) {
  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/styles/style.css" />
      <link rel="stylesheet" href="/styles/main.css" />
      <Favicons />
      <Preload preloadApi={props.preloadApi} />
      <MetaTags
        title={props.title}
        description={props.description}
        image={props.image}
        url={props.url}
      />
      <Analytics />
    </head>
  )
}
