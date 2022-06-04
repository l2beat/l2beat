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
        href="/fonts/Roboto/roboto-v27-latin-regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Roboto/roboto-v27-latin-700.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      {/* <link
        rel="stylesheet"
        type="text/css"
        href="https://cdn.datatables.net/1.12.1/css/jquery.dataTables.min.css"
      /> */}
      <script
        type="text/javascript"
        src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"
      />
      <script
        type="text/javascript"
        src="https://cdn.datatables.net/1.12.1/js/jquery.dataTables.min.js"
      />
    </>
  )
}
