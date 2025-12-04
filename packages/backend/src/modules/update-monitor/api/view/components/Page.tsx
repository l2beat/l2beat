import React, { type ReactNode } from 'react'

export interface PageProps {
  title: string
  children: ReactNode
  headerRight?: ReactNode
}

export function Page({ title, children, headerRight }: PageProps) {
  return (
    <html lang="en" style={{ backgroundColor: '#090c12', color: '#f7f5f0' }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          backgroundColor: '#090c12',
          color: '#f7f5f0',
          fontFamily: `'IBM Plex Mono', 'SFMono-Regular', Menlo, monospace`,
          padding: '36px 16px 72px',
          lineHeight: '1.5',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          <header
            style={{
              borderBottom: '2px solid #272727',
              paddingBottom: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '16px',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  flex: '1 1 auto',
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    fontSize: '34px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  {title}
                </h1>
                <p
                  style={{
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '12px',
                    color: '#c3c0b8',
                  }}
                >
                  update monitor dashboard
                </p>
              </div>
              {headerRight && (
                <div
                  style={{
                    flexShrink: 0,
                  }}
                >
                  {headerRight}
                </div>
              )}
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
