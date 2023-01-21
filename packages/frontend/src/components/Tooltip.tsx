import React from 'react'

export function Tooltip() {
  return (
    <div className="Tooltip-Popup shadow-[0px_2px_16px_0px_rgba(0,0,0,0.18)] text-sm hidden fixed top-0 left-0 max-w-[300px] px-4 py-3 z-50 bg-white dark:bg-gray-700 text-gray-700 dark:text-white text-left rounded-md leading-tight">
      <span />
      <svg
        width="16"
        height="8"
        viewBox="0 0 16 8"
        className="Tooltip-Triangle fixed top-0 left-0 -z-1 w-4 h-2 stroke-1 fill-white dark:fill-gray-700"
      >
        <path d="M0 8L8 1L16 8" />
      </svg>
    </div>
  )
}
