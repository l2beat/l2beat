'use client'

import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../_components/tooltip/tooltip'

// Easy way to disable anchor parents through tooltips

export default function Page() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <TooltipProvider>
        <Link href="/dev/1" className="p-4 bg-brand-black">
          <Tooltip>
            <TooltipTrigger className="bg-brand-red p-2">HERE</TooltipTrigger>
            <TooltipContent>
              Culpa ad elit exercitation tempor magna dolor sunt consectetur
              aliquip anim. Labore laboris ea aliquip ut enim elit enim
              adipisicing officia veniam excepteur. Officia nulla cupidatat anim
              proident eiusmod incididunt non occaecat magna ad occaecat anim.
              Tempor sit ad non sunt anim. Est cillum qui et id velit commodo
              amet cillum elit deserunt irure ex.
            </TooltipContent>
          </Tooltip>
        </Link>
      </TooltipProvider>
    </div>
  )
}
