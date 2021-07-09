import { ReactNode } from 'react'
import { Head } from './Head'

interface Props {
  title: string
  children: ReactNode
}

export function Page({ title, children }: Props) {
  return (
    <html lang="en">
      <Head title={title} />
      <body>
        <div className="page">{children}</div>
        <script src="/scripts/main.js" />
      </body>
    </html>
  )
}
