interface Props {
  title: string
}

export function Head({ title }: Props) {
  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/styles/main.css" />
      <link rel="icon" type="image/png" href="/icon.png" />
      <title>{title}</title>
    </head>
  )
}
