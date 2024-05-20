import Link from 'next/link'
import React from 'react'

import { Logo } from '../Logo'
import { DarkThemeToggle } from './DarkThemeToggle'
import { InputWallet } from './InputWallet'
import { ScannerName } from './ScannerName'

export function Navbar() {
  return (
    <>
      <div className="h-14 border-b border-[#272A3133] text-base dark:border-gray-850 lg:h-16">
        <nav className="relative mx-auto box-border flex h-full max-w-[1780px] items-center justify-between px-4 lg:px-8">
          <ul className="flex h-full items-center">
            <li className="mr-4 lg:mr-8">
              <Link href="/">
                <div className="flex flex-row gap-2 items-center">
                  <Logo className="h-8 w-auto" />
                  <ScannerName />
                </div>
              </Link>
            </li>
          </ul>
          <div className="flex items-center gap-3">
            <InputWallet />
            <DarkThemeToggle />
          </div>
        </nav>
      </div>
    </>
  )
}
