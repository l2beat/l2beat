import React from 'react'

export function Tooltip() {
  return (
    <div className="Tooltip-Popup fixed top-0 left-0 z-60 hidden max-w-[300px] rounded-md bg-white px-4 py-3 text-left text-sm leading-tight text-gray-700 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.55)] dark:bg-neutral-700 dark:text-white">
      <span />
      <svg
        width="16"
        height="8"
        viewBox="0 0 16 8"
        className="Tooltip-Triangle fixed top-0 left-0 -z-1 h-2 w-4 fill-white stroke-1 dark:fill-neutral-700"
      >
        <path d="M0 8L8 1L16 8" />
      </svg>
    </div>
  )
}
