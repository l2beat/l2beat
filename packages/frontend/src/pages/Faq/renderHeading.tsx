import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Heading } from '../../components'

export function renderHeading(level: number, title: string, id: string) {
  return renderToStaticMarkup(<Heading level={level} title={title} id={id} />)
}
