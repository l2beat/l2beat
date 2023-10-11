import React from 'react'

interface Props {
  preloadApi?: string | string[]
}

export function Preload(props: Props) {
  const preloadApi = props.preloadApi ? (
    Array.isArray(props.preloadApi) ? (
      props.preloadApi.map((href) => (
        <link rel="preload" href={href} as="fetch" />
      ))
    ) : (
      <link rel="preload" href={props.preloadApi} as="fetch" />
    )
  ) : null

  return (
    <>
      {preloadApi}
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
