import { ReactNode } from 'react'
import { Head } from './Head'

interface Props {
  title: string
  children: ReactNode
  preloadApi?: string
  includeMetaImageStyles?: boolean
}

export function Page(props: Props) {
  return (
    <html lang="en">
      <Head
        title={props.title}
        preloadApi={props.preloadApi}
        includeMetaImageStyles={props.includeMetaImageStyles}
      />
      <body>
        <div className="page">{props.children}</div>
        <script src="/scripts/main.js" />
      </body>
    </html>
  )
}
