import classNames from 'classnames'
import React, { forwardRef, ReactNode } from 'react'

interface SlideCardProps {
  className?: string
  title: string
  button: ReactNode
  children: ReactNode
}

export function SlideCard(props: SlideCardProps) {
  return (
    <div
      className={classNames(
        'SlideCard group relative w-min whitespace-pre',
        props.className,
      )}
    >
      <SlideCardToggle>{props.button}</SlideCardToggle>
      <SlideCardContent title={props.title}>{props.children}</SlideCardContent>
    </div>
  )
}

interface SlideCardToggleProps {
  children: ReactNode
}

function SlideCardToggle(props: SlideCardToggleProps) {
  return (
    <div className="flex items-center gap-x-4 rounded-lg bg-gray-100 px-1 py-1 dark:bg-gray-750">
      <label
        className="flex cursor-pointer items-center justify-between gap-1.5 px-2 text-base transition-all"
        data-role="chart-token-toggle"
      >
        <input
          type="checkbox"
          autoComplete="off"
          className="Slice-Card-Toggle peer hidden"
        />
        {props.children}
      </label>
    </div>
  )
}

interface SlideCardContentProps {
  title: string
  children: ReactNode
}

function SlideCardContent(props: SlideCardContentProps) {
  return (
    <div className="SlideCardContent fixed left-0 bottom-0 z-60 w-full whitespace-normal rounded-t-2xl bg-zinc-800">
      <div className="m-4 flex flex-wrap gap-4">
        <h2 className="text-3xl font-bold">{props.title}</h2>
        <div className="overflow-y-scroll max-h-[35rem]">
        {props.children}
        </div>
      </div>
      <div className="flex h-[6rem] w-full items-center justify-center bg-[#373B41]">
        <div className="flex h-[3rem] items-center justify-center rounded-md border border-pink-900 p-6 px-4">
          Close the overlay
        </div>
      </div>
    </div>
  )
}

// <div style="overflow-y: scroll; height:400px;">
