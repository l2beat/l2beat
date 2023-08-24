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

// NOTE(radomski): The linear gradients on the scrollable content consists of
// two parts each. The first part is the actual gradient and the other is an
// opaque color filler. The filler is set to overflow the container a little
// bit. The filler has a lower z-index then the gradient. All of this is needed
// because of how the browsers handles scaling factors like 95% and fractional
// sizes. To deal with those things the browser will linear interpolate between
// colors. This in turn does two things, allows text to go outside the
// container even if the overflow CSS flag is set and it blends colors on the
// edges of the container. The simplest solution I've found to go around it is
// to create that filler block that will make sure to always have a hard stop
// even on non-integer scaling/sizes.
function SlideCardContent(props: SlideCardContentProps) {
  return (
    <div className="SlideCard-Content fixed left-0 top-0 bottom-0 z-999 flex h-[100dvh] w-full translate-y-full flex-col whitespace-normal bg-black/50 transition-transform duration-300 ease-out">
      <div className="h-[10%]" />
      <div className="flex h-full flex-col gap-4 rounded-t-2xl bg-gray-100 p-4 dark:bg-zinc-800">
        <h2 className="text-3xl font-bold">{props.title}</h2>
        <div className="relative flex grow flex-wrap">
          <div className="pointer-events-none absolute inset-x-0 top-[-2px] z-10 h-[4px] bg-gray-100 dark:bg-zinc-800" />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-4 bg-gradient-to-b from-gray-100 via-gray-100/60 to-transparent dark:from-zinc-800 dark:via-zinc-800/60" />
          <div className="absolute inset-0 overflow-auto scroll-smooth">
            <div className="pointer-events-none h-4" />
            {props.children}
            <div className="pointer-events-none h-8" />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-8 bg-gradient-to-t from-gray-100 via-gray-100/60 to-transparent dark:from-zinc-800 dark:via-zinc-800/60" />
          <div className="pointer-events-none absolute inset-x-0 bottom-[-2px] z-10 h-[4px] bg-gray-100 dark:bg-zinc-800" />
        </div>
      </div>
      <div className="flex w-full items-center justify-center bg-gray-200 py-6 dark:bg-[#373B41] ">
        <div className="flex items-center justify-center rounded-md bg-pink-900 py-3 px-4 text-white">
          <SlideCardToggle type="close">
            {props.closeButtonText ?? 'Close the overlay'}
          </SlideCardToggle>
        </div>
      </div>
    </div>
  )
}
