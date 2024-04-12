import React from 'react'

interface Props {
  preloadApis?: string[]
}

export function Preload(props: Props) {
  return (
    <>
      {props.preloadApis?.map((api) => (
        <link
          rel="preload"
          key={api}
          href={api}
          as="fetch"
          crossOrigin="anonymous"
        />
      ))}
      <link
        rel="preload"
        href="/fonts/roboto/roboto-v30-latin-regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin=""
      />
      <link
        rel="preload"
        href="/fonts/roboto/roboto-v30-latin-500.woff2"
        as="font"
        type="font/woff2"
        crossOrigin=""
      />
      <link
        rel="preload"
        href="/fonts/roboto/roboto-v30-latin-700.woff2"
        as="font"
        type="font/woff2"
        crossOrigin=""
      />
    </>
  )
}
