import React from 'react'

interface Props {
  preloadApi?: string
}

export function Preload(props: Props) {
  return (
    <>
      {props.preloadApi && (
        <link rel="preload" href={props.preloadApi} as="fetch" />
      )}
      <link
        rel="preload"
        href="/fonts/Roboto/roboto-v30-latin-regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Roboto/roboto-v30-latin-500.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Roboto/roboto-v30-latin-700.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </>
  )
}
