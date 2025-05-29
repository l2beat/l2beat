import React from 'react'

export function GrayedOut(props: {
  children: React.ReactNode
}) {
  return (
    <div className="!fill-secondary !text-secondary [&_*]:!fill-secondary [&_*]:!text-secondary">
      {props.children}
    </div>
  )
}
