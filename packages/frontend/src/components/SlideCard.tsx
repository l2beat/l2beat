import classNames from 'classnames'
import React, { ReactNode } from 'react'

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
      <SlideCardToggle type="open">{props.button}</SlideCardToggle>
      <SlideCardContent title={props.title}>{props.children}</SlideCardContent>
    </div>
  )
}

interface SlideCardToggleProps {
  children: ReactNode
  type: 'open' | 'close'
}

function SlideCardToggle(props: SlideCardToggleProps) {
  return (
    <label
      className="flex cursor-pointer items-center justify-between"
      data-role="chart-token-toggle"
    >
      <input
        type="checkbox"
        autoComplete="off"
        className="SlideCard-Toggle peer hidden"
        data-role={props.type}
      />
      {props.children}
    </label>
  )
}

interface SlideCardContentProps {
  title: string
  children: ReactNode
}

function SlideCardContent(props: SlideCardContentProps) {
  return (
    <div className="SlideCard-Content transition-300 fixed left-0 top-0 bottom-0 z-999 flex h-[100vh] w-full translate-y-full flex-col whitespace-normal bg-black/50 transition-transform ease-out">
      <div className="h-[10%]" />
      <div className="flex h-[90%] flex-col rounded-t-2xl bg-zinc-800">
        <h2 className="m-4 mb-0 text-3xl font-bold">{props.title}</h2>
        <div className="relative m-4 flex grow flex-wrap">
          <div className="absolute inset-0 overflow-auto scroll-smooth">
            <div className="sticky inset-x-0 top-0 h-4 bg-gradient-to-b from-zinc-800 via-zinc-800/60 to-transparent" />
            {props.children}
            <div className="sticky inset-x-0 bottom-0 h-8 bg-gradient-to-t from-zinc-800 via-zinc-800/60 to-transparent" />
          </div>
        </div>
      </div>
      <div className="flex h-[12%] w-full items-center justify-center bg-[#373B41]">
        <div className="flex h-[6%] items-center justify-center rounded-md border border-pink-900 p-[6%] px-4">
          <SlideCardToggle type="close"> Close the overlay </SlideCardToggle>
        </div>
      </div>
    </div>
  )
}
