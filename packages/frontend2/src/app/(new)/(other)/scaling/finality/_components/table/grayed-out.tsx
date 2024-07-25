import React from 'react'

export function GrayedOut(props: {
  children: React.ReactNode
  grayOut: boolean
}) {
  if (props.grayOut) {
    return (
      <div className="[&_*]:!fill-gray-500 [&_*]:!text-gray-500">
        {props.children}
      </div>
    )
  }
  return props.children
}
