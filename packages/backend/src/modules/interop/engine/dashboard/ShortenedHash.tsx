import React from 'react'

export function ShortenedHash({ hash }: { hash: string | undefined }) {
  if (!hash) return null
  if (hash.length <= 14) return <>{hash}</>
  return (
    <>
      <span style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
        {hash}
      </span>
      {`${hash.slice(0, 6)}...${hash.slice(-4)}`}
    </>
  )
}
