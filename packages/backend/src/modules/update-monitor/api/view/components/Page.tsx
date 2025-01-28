import React, { type ReactNode } from 'react'

export interface PageProps {
  title: string
  children: ReactNode
}

export function Page({ title, children }: PageProps) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://classless.de/classless.css" />
        <link rel="stylesheet" href="https://classless.de/addons/tabbox.css" />
        <link rel="stylesheet" href="https://classless.de/addons/themes.css" />
        <style>{':root{--width:1200px}'}</style>
        <title>{title}</title>
      </head>
      <body style={{ marginTop: '0px', paddingTop: '8px' }}>
        <h1 style={{ marginTop: '0px' }}>{title}</h1>
        {children}
      </body>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.documentElement.setAttribute('data-theme', 'dark')
        `,
        }}
      />
    </html>
  )
}
