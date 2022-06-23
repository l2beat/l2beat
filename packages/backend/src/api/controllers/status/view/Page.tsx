import React, { ReactNode } from 'react'

export interface PageProps {
  title: string
  children: ReactNode
}

export function Page({ title, children }: PageProps) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://classless.de/classless.css" />
        <style>{':root{--width:1200px}'}</style>
        <title>{title}</title>
      </head>
      <body>
        <h1>{title}</h1>
        {children}
      </body>
    </html>
  )
}
