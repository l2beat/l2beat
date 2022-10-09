import cx from 'classnames'
import React from 'react'

export interface IncludeLayer2sCheckboxProps {
  className?: string
}

export function IncludeLayer2sCheckbox({
  className,
}: IncludeLayer2sCheckboxProps) {
  return (
    <label
      className={cx(
        'text-base font-medium bg-gray-200 dark:bg-gray-800',
        'inline-flex items-center p-1 pr-2 gap-2 rounded-lg cursor-pointer',
        className,
      )}
    >
      <input
        data-role="chart-combined"
        id="combined-bridges"
        type="checkbox"
        autoComplete="off"
        className="peer hidden"
      />
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        role="img"
        fill="none"
        stroke="none"
        className="peer-checked:stroke-black dark:peer-checked:stroke-white"
      >
        <rect
          x="0"
          y="0"
          width="24"
          height="24"
          rx="6"
          ry="6"
          stroke="none"
          className="fill-white dark:fill-black"
        />
        <path
          d="M4.95 12.95L9.35 17.3L19.05 7.6"
          strokeWidth="2.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Include canonical bridges to Layer2s</span>
    </label>
  )
}
