import React from 'react'

interface Props {
  title: string
  icon: string | undefined
}

export function ProjectHeader(props: Props) {
  return (
    <h1 className="relative mb-0 flex items-center justify-start gap-3 whitespace-pre text-3xl font-bold md:text-4xl">
      {props.icon && (
        <img
          className="size-8 md:size-10"
          src={props.icon}
          alt={`${props.title} logo`}
        />
      )}
      {props.title}
    </h1>
  )
}
