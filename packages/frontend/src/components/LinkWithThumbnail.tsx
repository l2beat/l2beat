import type React from 'react'

import { ArrowRightIcon } from '~/icons/ArrowRight'
import { PlainLink } from './PlainLink'

interface LinkWithThumbnailProps {
  title: string
  description?: string
  src: string
  width: number
  height: number
  href: string
  topAccessory?: React.ReactNode
}

export function LinkWithThumbnail(props: LinkWithThumbnailProps) {
  return (
    <PlainLink
      href={props.href}
      className="group flex gap-6 rounded-md bg-surface-primary transition-colors hover:bg-surface-secondary"
    >
      <img
        src={props.src}
        alt={`Thumbnail of ${props.title}`}
        className="aspect-video w-full max-w-36 rounded-md object-cover object-center transition-[scale] will-change-transform group-hover:scale-105 md:max-w-48"
        height={props.height}
        width={props.width}
      />
      <div className="self-center py-[15px] transition-transform group-hover:translate-x-0.5">
        <div>
          {props.topAccessory && <div>{props.topAccessory}</div>}
          <p className="text-balance text-heading-16 md:text-heading-18">
            {props.title}
          </p>
          {props.description && (
            <div className="hidden md:block">
              <p className="line-clamp-1 font-normal text-paragraph-14 text-secondary">
                {props.description}
              </p>
            </div>
          )}
        </div>
        <p className="flex flex-wrap items-center gap-1 font-bold text-label-value-14 text-link underline transition-colors group-hover:text-blue-550 md:mt-3">
          Read now
          <ArrowRightIcon className="fill-current" />
        </p>
      </div>
    </PlainLink>
  )
}
