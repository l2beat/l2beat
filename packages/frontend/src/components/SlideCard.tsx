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
    <div className="SlideCard-Content transition-300 fixed left-0 bottom-0 z-60 w-full translate-y-full whitespace-normal rounded-t-2xl bg-zinc-800 transition-transform ease-out">
      <div className="m-4 flex flex-wrap gap-4">
        <h2 className="text-3xl font-bold">{props.title}</h2>
        <div>
          <div className="max-h-[35rem] overflow-y-scroll scroll-smooth">
            <div className="sticky inset-x-0 top-0 h-4 bg-gradient-to-b from-zinc-800 via-zinc-800/60 to-transparent" />
            {props.children}
            <div className="sticky inset-x-0 bottom-0 h-8 bg-gradient-to-t from-zinc-800 via-zinc-800/60 to-transparent" />
          </div>
        </div>
      </div>
      <div className="flex h-[6rem] w-full items-center justify-center bg-[#373B41]">
        <div className="flex h-[3rem] items-center justify-center rounded-md border border-pink-900 p-6 px-4">
          <SlideCardToggle type="close"> Close the overlay </SlideCardToggle>
        </div>
      </div>
    </div>
  )
}

//background: linear-gradient(180deg, rgba(39, 42, 47, 0.00) 0%, rgba(39, 42, 47, 0.60) 51.04%, #272A2F 100%);
