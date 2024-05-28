import Link from 'next/link'
import { Logo } from '../Logo'
import { InputWallet } from './InputWallet'
import { NavbarDrawerTrigger } from './NavbarDrawerTrigger'
import { ScannerName } from './ScannerName'
import { WalletDrawer } from './WalletDrawer'
import { WalletInfo } from './WalletInfo'

export function Navbar() {
  return (
    <>
      <div className="h-14 border-b border-[#272A3133] min-w-fit text-base dark:border-gray-850 lg:h-16">
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
          <div className="items-center gap-3 hidden md:flex">
            <InputWallet />
            <WalletInfo />
          </div>
          <div className="inline-block md:hidden">
            <WalletDrawer>
              <NavbarDrawerTrigger />
            </WalletDrawer>
          </div>
        </nav>
      </div>
    </>
  )
}
