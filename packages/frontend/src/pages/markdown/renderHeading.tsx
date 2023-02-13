import React, { createElement, HTMLAttributes } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

export function renderHeading(
  level: number,
  content: string | null,
  id: string,
) {
  if (content === null) {
    return
  }

  return renderToStaticMarkup(
    <Hx level={level} id={id}>
      <a
        className="Heading-Title"
        href={`#${id}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Hx>,
  )
}

function Hx({
  level,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { level: number }) {
  return createElement(`h${level}`, props)
}
