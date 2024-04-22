import Link from 'next/link'
import React from 'react'

import { Logo } from '../Logo'
import { DarkThemeToggle } from './DarkThemeToggle'
import { VerticalBar } from './VerticalBar'

export function Navbar() {
  return (
    <>
      <div className="h-14 border-b border-gray-200 text-base dark:border-gray-850 lg:h-16">
        <nav className="relative mx-auto box-border flex h-full max-w-[1780px] items-center justify-between px-4 lg:px-12">
          <ul className="flex h-full items-center">
            <li className="mr-4 lg:mr-8">
              <Link href="/">
                <div className="flex flex-row gap-2 items-center">
                  <Logo className="h-8 w-auto" />
                  <span className="font-medium px-2">Asset Risk Prototype</span>
                </div>
              </Link>
            </li>
          </ul>
          <div className="hidden h-full items-center gap-5 lg:flex">
            <ul className="flex h-full items-center gap-1.5">
              <li className="h-full">
                <a
                  className="flex h-full items-center px-2 font-medium"
                  href="https://l2beat.com"
                >
                  Go back to L2BEAT
                </a>
              </li>
            </ul>
            <VerticalBar />
            <DarkThemeToggle />
          </div>
        </nav>
      </div>
    </>
  )
}
