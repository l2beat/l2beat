import React from 'react'

export function GrayedOut(props: {
  children: React.ReactNode
}) {
  return (
    <div className="[&_*]:!fill-gray-500 [&_*]:!text-gray-500">
      {props.children}
    </div>
  )
}
