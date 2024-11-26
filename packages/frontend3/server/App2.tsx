import { asset } from './assets'

export function App2() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href={asset('duck.png')} type="image/png" />
        <link rel="stylesheet" href={asset('main.css')} />
        <title>Demo</title>
      </head>
      <body>
        <h1 className="text-red-600">Hello world!</h1>
        <a href="/">Link to app</a>
        <script src={asset('main.js')}></script>
      </body>
    </html>
  )
}
