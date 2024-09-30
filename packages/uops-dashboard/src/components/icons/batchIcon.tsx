import { Tooltip } from 'flowbite-react'

export function BatchIcon({ tooltipContent }: { tooltipContent: string }) {
  return (
    <Tooltip content={tooltipContent}>
      <svg
        className="ml-2 h-8 w-8 text-gray-900 dark:text-white"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {' '}
        <path stroke="none" d="M0 0h24v24H0z" />{' '}
        <polyline points="12 4 4 8 12 12 20 8 12 4" />{' '}
        <polyline points="4 12 12 16 20 12" />{' '}
        <polyline points="4 16 12 20 20 16" />
      </svg>
    </Tooltip>
  )
}
