import React from 'react'

export function GrayedOut(props: {
  children: React.ReactNode
  grayOut: boolean
}) {
  if (props.grayOut) {
    return (
      <div className="[&_*]:!text-gray-500 [&_*]:!fill-gray-500">
        {props.children}
      </div>
    )
  }
  return props.children
}
