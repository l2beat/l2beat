import { ReactNode } from 'react'
import { asset } from './assets'

interface Props {
  title: string
  children: ReactNode
}

export function Page(props: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="shortcut icon"
          href={asset('img/duck.png')}
          type="image/png"
        />
        <link rel="stylesheet" href={asset('main.css')} />
        <title>{props.title}</title>
      </head>
      <body>
        {props.children}
        <script src={asset('main.js')}></script>
      </body>
    </html>
  )
}
