import type React from 'react'

export function GrayedOut(props: { children: React.ReactNode }) {
  return (
    <div className="fill-secondary! text-secondary! **:fill-secondary! **:text-secondary!">
      {props.children}
    </div>
  )
}
