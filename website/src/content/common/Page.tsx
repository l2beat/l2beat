import { ReactNode } from 'react'
import { Head } from './Head'

interface Props {
  title: string
  children: ReactNode
  preloadApi?: string
}

export function Page({ title, children, preloadApi }: Props) {
  return (
    <html lang="en">
      <Head title={title} preloadApi={preloadApi} />
      <body>
        <div className="page">{children}</div>
        <script src="/scripts/main.js" />
      </body>
    </html>
  )
}
