import Link from 'next/link'

import { DrawerTrigger } from '~/app/asset-risks/_components/drawer'
import { ScannerNameIcon } from '../../_assets/scanner-name'
import { SmallLogo } from '../../_assets/small-logo'
import { InputWallet } from '../input-wallet'
import { WalletDrawer } from '../wallet-drawer'

export function Navbar() {
  return (
    <>
      <div className="sticky top-0 z-30 h-14 min-w-fit border-b border-[#272A3133] bg-n-gray-200 text-base dark:border-gray-850 lg:h-16">
        <nav className="relative mx-auto box-border flex h-full max-w-[1780px] items-center justify-between px-4 lg:px-8">
          <ul className="flex h-full items-center">
            <li className="mr-4 lg:mr-8">
              <Link href="/asset-risks">
                <div className="flex flex-row items-center gap-2">
                  <SmallLogo className="h-8 w-auto" />
                  <ScannerNameIcon />
                </div>
              </Link>
            </li>
          </ul>
          <div className="hidden items-center gap-3 md:flex">
            <InputWallet />
          </div>
          <div className="inline-block md:hidden">
            <WalletDrawer>
              <DrawerTrigger>
                <button className="rounded bg-pink-900 px-6 py-2 text-xs font-bold text-white">
                  Scan assets
                </button>
              </DrawerTrigger>
            </WalletDrawer>
          </div>
        </nav>
      </div>
    </>
  )
}
