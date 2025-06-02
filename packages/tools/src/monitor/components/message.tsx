'use client'
import React, { type MouseEventHandler, useState } from 'react'

interface MessageProps {
  authorName: string
  timestamp: string
  title: React.ReactNode
  content: React.ReactNode
  avatarUrl?: string
  className?: string
}

export function Message({
  authorName,
  timestamp,
  content,
  avatarUrl,
  title,
  className = '',
}: MessageProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleExpand: MouseEventHandler<HTMLDivElement> = (e) => {
    // Toggle on parent element dispatch only
    if (e.target === e.currentTarget) {
      setIsExpanded((prev) => !prev)
    }
  }

  return (
    <div
      className={`group flex rounded-sm px-4 py-2 transition-colors hover:bg-gray-800 ${className} w-full flex-col ${isExpanded && 'bg-gray-800'}`}
    >
      <div
        className="flex w-full cursor-pointer justify-between"
        onClick={toggleExpand}
      >
        {/* Avatar */}
        <div className="flex">
          <div className="mt-1 mr-4 shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                width={40}
                height={40}
                alt={`${authorName}'s avatar`}
                className="size-10 rounded-full"
              />
            ) : (
              <div className="size-10 rounded-full bg-gray-600" />
            )}
          </div>

          {/* Message metadata */}
          <div className="flex flex-col justify-between">
            {/* Author and Timestamp */}
            <div className="flex items-baseline space-x-2">
              <span className="font-semibold text-gray-100 text-sm">
                {authorName}
              </span>
              <span className="text-gray-400 text-xs">{timestamp}</span>
            </div>

            {/* Message Text */}
            <div className="flex items-start gap-2">
              <p className="whitespace-pre-wrap text-gray-300 text-sm leading-snug">
                {title}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-0.5 rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Message content */}
      {isExpanded && (
        <div className="cursor-default whitespace-pre-wrap text-gray-300 text-sm leading-snug md:ml-14">
          {content}
        </div>
      )}
    </div>
  )
}
