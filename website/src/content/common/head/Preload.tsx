interface Props {
  preloadApi?: string
}

export function Preload(props: Props) {
  return (
    <>
      {props.preloadApi && (
        <link
          rel="preload"
          href={props.preloadApi}
          as="fetch"
          crossOrigin="anonymous"
        />
      )}
      <link
        rel="preload"
        href="/fonts/Roboto/Roboto-Regular.ttf"
        as="font"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Roboto/Roboto-Bold.ttf"
        as="font"
        crossOrigin="anonymous"
      />
    </>
  )
}
