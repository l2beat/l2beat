import classNames from 'classnames'
import React, { ReactNode } from 'react'

interface SlideCardProps {
  className?: string
  title: string
  button: ReactNode
  closeButtonText?: string
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
      <SlideCardContent
        title={props.title}
        closeButtonText={props.closeButtonText}
      >
        {props.children}
      </SlideCardContent>
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
  closeButtonText?: string
  children: ReactNode
}

function SlideCardContent(props: SlideCardContentProps) {
  return (
    <div className="SlideCard-Content transition-300 fixed left-0 top-0 bottom-0 z-999 flex h-[100dvh] w-full translate-y-full flex-col whitespace-normal bg-black/50 transition-transform ease-out">
      <div className="h-[10%]" />
      <div className="flex h-[90%] flex-col rounded-t-2xl bg-gray-100 dark:bg-zinc-800">
        <h2 className="m-4 mb-0 text-3xl font-bold">{props.title}</h2>
        <div className="relative m-4 flex grow flex-wrap">
          <div className="absolute inset-0 overflow-auto scroll-smooth">
            <div className="from sticky inset-x-0 top-0 h-4 bg-gradient-to-b from-gray-100 via-gray-100/60 to-transparent dark:from-zinc-800 dark:via-zinc-800/60" />
            {props.children}
            <div className="sticky inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-100 via-gray-100/60 to-transparent dark:from-zinc-800 dark:via-zinc-800/60" />
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center bg-gray-200 py-6 dark:bg-[#373B41] ">
        <div className="flex items-center justify-center rounded-md bg-pink-900 py-3 px-4">
          <SlideCardToggle type="close">
            {props.closeButtonText ?? 'Close the overlay'}
          </SlideCardToggle>
        </div>
      </div>
    </div>
  )
}
