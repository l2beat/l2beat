interface Props {
  title: string
  preloadApi?: string
}

export function Head({ title, preloadApi }: Props) {
  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/styles/main.css" />
      <link rel="icon" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/mask-icon.svg" color="#000000" />
      {preloadApi && (
        <link
          rel="preload"
          href={preloadApi}
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
      <title>{title}</title>
    </head>
  )
}
